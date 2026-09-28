"""
Shared enumerations used across the attack-engine's typed models.

These are intentionally centralized here (rather than duplicated per
agent) so the Attack Planner and every downstream agent (Prompt Generator,
Execution Coordinator, Response Analyzer, Risk Scorer, Mitigation
Generator) speak the same vocabulary when they are implemented.
"""
from __future__ import annotations

from enum import Enum


class Severity(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


def severity_rank(severity: Severity) -> int:
    """Ordinal rank for sorting (higher = more severe)."""
    return list(Severity).index(severity)


def bump_severity(severity: Severity, levels: int = 1) -> Severity:
    """Escalate a severity by `levels` steps, clamped at CRITICAL."""
    order = list(Severity)
    idx = min(order.index(severity) + levels, len(order) - 1)
    return order[idx]


class OwaspLlmCategory(str, Enum):
    """OWASP Top 10 for LLM Applications (2025)."""

    LLM01_PROMPT_INJECTION = "LLM01:2025 Prompt Injection"
    LLM02_INSECURE_OUTPUT_HANDLING = "LLM02:2025 Insecure Output Handling"
    LLM03_TRAINING_DATA_POISONING = "LLM03:2025 Training Data Poisoning"
    LLM04_DATA_MODEL_POISONING = "LLM04:2025 Data and Model Poisoning"
    LLM05_SUPPLY_CHAIN = "LLM05:2025 Supply Chain Vulnerabilities"
    LLM06_SENSITIVE_INFORMATION_DISCLOSURE = "LLM06:2025 Sensitive Information Disclosure"
    LLM07_SYSTEM_PROMPT_LEAKAGE = "LLM07:2025 System Prompt Leakage"
    LLM08_EXCESSIVE_AGENCY = "LLM08:2025 Excessive Agency"
    LLM09_MISINFORMATION = "LLM09:2025 Misinformation"
    LLM10_UNBOUNDED_CONSUMPTION = "LLM10:2025 Unbounded Consumption"


class MitreAtlasCategory(str, Enum):
    """MITRE ATLAS (Adversarial Threat Landscape for AI Systems) Techniques."""

    DIRECT_INJECTION = "AML.T0051.000 (LLM Prompt Injection: Direct)"
    INDIRECT_INJECTION = "AML.T0051.001 (LLM Prompt Injection: Indirect)"
    LLM_JAILBREAK = "AML.T0054 (LLM Jailbreak)"
    PLUGIN_COMPROMISE = "AML.T0053 (LLM Plugin Compromise / Tool Abuse)"
    DATA_EXFILTRATION = "AML.T0048 (Exfiltration via AI API)"
    DENIAL_OF_SERVICE = "AML.T0029 (LLM Denial of Service)"
    SYSTEM_EXTRACTION = "AML.T0055 (System Prompt & Model Extraction)"


class NistAiRmfCategory(str, Enum):
    """NIST AI Risk Management Framework (AI RMF 1.0) Dimensions."""

    MEASURE_SECURITY = "MEASURE 2.6: Security, Resilience & Safety"
    MEASURE_INTEGRITY = "MEASURE 2.7: Data Integrity & Poisoning"
    MEASURE_PRIVACY = "MEASURE 2.5: Privacy & Confidentiality"
    MANAGE_THIRD_PARTY = "MANAGE 2.4: Third-Party & Tool Integration Risk"
    GOVERN_TRANSPARENCY = "GOVERN 1.2: Transparency & Model Disclosure"


class ComponentType(str, Enum):
    """Mirrors the Digital Twin graph's node labels (see
    digital-twin/graph/builder.py once implemented). The Planner consumes
    these - it must never invent new labels the twin doesn't produce."""

    USER = "User"
    ASSISTANT = "Assistant"
    PROMPT = "Prompt"
    RETRIEVER = "Retriever"
    VECTOR_DB = "VectorDB"
    SQL = "SQL"
    EMAIL = "Email"
    SLACK = "Slack"
    GOOGLE_DRIVE = "GoogleDrive"
    API = "API"
    DOCUMENT = "Document"
    FUNCTION = "Function"
    MEMORY = "Memory"
    UNKNOWN = "Unknown"


class AttackCategory(str, Enum):
    PROMPT_INJECTION = "prompt_injection"
    INDIRECT_PROMPT_INJECTION = "indirect_prompt_injection"
    RAG_POISONING = "rag_poisoning"
    TOOL_MISUSE = "tool_misuse"
    FUNCTION_CALLING_MISUSE = "function_calling_misuse"
    MEMORY_MANIPULATION = "memory_manipulation"
    SYSTEM_PROMPT_EXPOSURE = "system_prompt_exposure"
    EXCESSIVE_AGENCY = "excessive_agency"
    DATA_ACCESS_VALIDATION = "data_access_validation"
    AGENT_WORKFLOW_MANIPULATION = "agent_workflow_manipulation"
    MULTI_TURN_REASONING = "multi_turn_reasoning"
    SAFETY_BOUNDARY = "safety_boundary"

    # --- Added for the Prompt Generator's broader family coverage. Members
    # only ever appended below this line - never renamed/removed - so
    # existing AttackScenario/AttackPatternCatalog data stays valid. ---
    JAILBREAK = "jailbreak"
    ROLE_MANIPULATION = "role_manipulation"
    GOAL_HIJACKING = "goal_hijacking"
    DATA_EXFILTRATION = "data_exfiltration"
    CODE_INTERPRETER_ABUSE = "code_interpreter_abuse"
    CHAIN_OF_THOUGHT_EXTRACTION = "chain_of_thought_extraction"
    CONTEXT_WINDOW_OVERFLOW = "context_window_overflow"
    ENCODING_ATTACK = "encoding_attack"
    DELIMITER_CONFUSION = "delimiter_confusion"
    HIDDEN_INSTRUCTION_INJECTION = "hidden_instruction_injection"
    SQL_INJECTION_VIA_LLM = "sql_injection_via_llm"


class MutationStrategy(str, Enum):
    """Prompt-variant mutation strategies used by the Prompt Generator."""

    IDENTITY = "identity"
    PARAPHRASE = "paraphrase"
    SYNONYM_REPLACEMENT = "synonym_replacement"
    WHITESPACE = "whitespace"
    UNICODE_HOMOGLYPH = "unicode_homoglyph"
    CASE_RANDOMIZATION = "case_randomization"
    MULTILINGUAL = "multilingual"
