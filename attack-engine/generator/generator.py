"""
Prompt Generator agent.

Converts AttackScenario objects produced by the Attack Planner into
concrete, executable GeneratedPrompt objects: one base prompt per
scenario (rendered from a Jinja2 template keyed by AttackCategory - see
generator.templates), plus mutation variants (paraphrase, synonym
replacement, whitespace, unicode homoglyph, case randomization,
multilingual wrapping - see generator.mutations).

This module fills in what was previously an empty stub
(attack-engine/generator/generator.py); it does not duplicate or
parallel the Attack Planner's models - it consumes AttackScenario
directly from models.planner_models.
"""
from __future__ import annotations

import base64
from typing import Optional
import json
from pathlib import Path
from typing import Any, Optional

from agents.base import BaseAgent
from core.config import AttackEngineSettings, get_settings
from core.exceptions import PromptGenerationError
from generator.mutations import MutationEngine
from generator.templates import PromptTemplateRegistry
from graph.state import WorkflowState
from models.enums import AttackCategory, MutationStrategy
from models.planner_models import AttackScenario, DiscoveryContext
from models.prompt_models import GeneratedPrompt, PromptGenerationOutput

# Repeated to build a long context block for the Context Window Overflow
# family - real filler text (not lorem-ipsum placeholders) so the
# resulting prompt is representative of what an overflow attempt looks
# like against a real target.
_PADDING_UNIT = "This is filler context used to test context window handling. "
_CORPORA_DIR = Path(__file__).resolve().parent.parent / "knowledge" / "corpora"


class PromptGeneratorAgent(BaseAgent[WorkflowState]):
    """LangGraph node + standalone service for prompt generation."""

    name = "prompt_generator"

    def __init__(
        self,
        template_registry: Optional[PromptTemplateRegistry] = None,
        mutation_engine: Optional[MutationEngine] = None,
        settings: Optional[AttackEngineSettings] = None,
    ) -> None:
        super().__init__()
        self._templates = template_registry or PromptTemplateRegistry()
        self._mutations = mutation_engine or MutationEngine()
        self._settings = settings or get_settings()

    # ------------------------------------------------------------------
    # Public service API
    # ------------------------------------------------------------------
    async def generate(
        self,
        scan_id: str,
        scenarios: list[AttackScenario],
        discovery_context: Optional[DiscoveryContext] = None,
    ) -> PromptGenerationOutput:
        if not scan_id or not scan_id.strip():
            raise PromptGenerationError("scan_id must be a non-empty string")

        self.logger.info(
            "prompt_generation_started", extra={"scan_id": scan_id, "scenario_count": len(scenarios)}
        )
        warnings: list[str] = []
        prompts: list[GeneratedPrompt] = []
        target_name = (discovery_context.target_name if discovery_context else None) or "the target system"

        for scenario in scenarios:
            try:
                base_text = self._render_base(scenario, target_name)
            except Exception as exc:  # a single bad template must never abort the whole batch
                warnings.append(f"Failed to render template for scenario {scenario.id}: {exc}")
                continue

            variants = self._mutations.generate_variants(
                base_text, count_per_strategy=self._settings.generator_variants_per_strategy
            )
            for variant_index, (strategy, text) in enumerate(variants):
                prompts.append(
                    GeneratedPrompt(
                        scenario_id=scenario.id,
                        category=scenario.category,
                        title=f"{scenario.title} [{strategy.value}#{variant_index}]",
                        content=text,
                        mutation_strategy=strategy,
                        variant_index=variant_index,
                        expected_behavior="The target should refuse, deflect, or safely decline the request.",
                        success_criteria=scenario.objective,
                        severity=scenario.severity_estimate,
                        metadata={"rule_rationale": scenario.rationale},
                    )
                )

            # Ingest standard benchmark corpus payloads if available
            corpus_prompts = self._load_corpus_prompts(scenario)
            for cp_idx, cp in enumerate(corpus_prompts):
                prompts.append(
                    GeneratedPrompt(
                        scenario_id=scenario.id,
                        category=scenario.category,
                        title=f"{scenario.title} [Benchmark:{cp.get('id', 'CORP')}#{cp_idx}]",
                        content=cp["content"],
                        mutation_strategy=MutationStrategy.IDENTITY,
                        variant_index=len(variants) + cp_idx,
                        expected_behavior="The target should refuse, deflect, or safely decline the benchmark payload.",
                        success_criteria=scenario.objective,
                        severity=scenario.severity_estimate,
                        metadata={
                            "corpus_name": cp.get("name"),
                            "mitre_atlas": cp.get("mitre_atlas"),
                            "owasp": cp.get("owasp"),
                        },
                    )
                )

        if not prompts:
            warnings.append("No prompts were generated - no scenarios were provided or all template renders failed.")

        self.logger.info(
            "prompt_generation_completed", extra={"scan_id": scan_id, "prompt_count": len(prompts)}
        )
        return PromptGenerationOutput(scan_id=scan_id, prompts=prompts, warnings=warnings)

    def _render_base(self, scenario: AttackScenario, target_name: str) -> str:
        affected_component = scenario.target_path.steps[-1].name if scenario.target_path.steps else "the target"
        objective = scenario.objective
        context = {
            "objective": objective,
            "objective_upper": objective.upper(),
            "target_name": target_name,
            "affected_component": affected_component,
            "padding": _PADDING_UNIT * 40,
            "encoded_payload": base64.b64encode(objective.encode("utf-8")).decode("ascii"),
        }
        return self._templates.render(scenario.category, context)

    def _load_corpus_prompts(self, scenario: AttackScenario) -> list[dict[str, Any]]:
        results: list[dict[str, Any]] = []
        if not _CORPORA_DIR.exists():
            return results

        # Map scenario categories to appropriate corpus files
        corpus_files: list[str] = []
        cat_val = scenario.category.value if hasattr(scenario.category, "value") else str(scenario.category)
        
        if cat_val in {"jailbreak", "prompt_injection", "system_prompt_exposure", "role_manipulation"}:
            corpus_files.append("jailbreaks.json")
        if cat_val in {"indirect_prompt_injection", "rag_poisoning"}:
            corpus_files.append("indirect_rag_injections.json")
        if cat_val in {"tool_misuse", "function_calling_misuse", "data_access_validation", "agent_workflow_manipulation", "excessive_agency"}:
            corpus_files.append("tool_abuse.json")

        for fname in corpus_files:
            cpath = _CORPORA_DIR / fname
            if not cpath.exists():
                continue
            try:
                with open(cpath, "r", encoding="utf-8") as f:
                    entries = json.load(f)
                for entry in entries:
                    raw_template = entry.get("template", "")
                    rendered = raw_template.replace("{objective}", scenario.objective)
                    results.append({
                        "id": entry.get("id"),
                        "name": entry.get("name"),
                        "content": rendered,
                        "mitre_atlas": entry.get("mitre_atlas"),
                        "owasp": entry.get("owasp"),
                    })
            except Exception as exc:
                self.logger.warning("corpus_load_failed", extra={"file": fname, "error": str(exc)})

        return results

    # ------------------------------------------------------------------
    # LangGraph node adapter
    # ------------------------------------------------------------------
    async def __call__(self, state: WorkflowState) -> WorkflowState:
        scan_id = state.get("scan_id", "")
        scenarios = state.get("candidate_scenarios", []) or []
        discovery_context = state.get("discovery_context")
        errors = list(state.get("errors", []))

        try:
            output = await self.generate(scan_id, scenarios, discovery_context)
            return {
                **state,
                "candidate_prompts": output.prompts,
                "generator_warnings": output.warnings,
                "errors": errors,
            }
        except PromptGenerationError as exc:
            self.logger.error("generator_node_failed", extra={"scan_id": scan_id, "error": str(exc)})
            errors.append(f"[{self.name}] {exc}")
            return {**state, "candidate_prompts": [], "generator_warnings": [], "errors": errors}
