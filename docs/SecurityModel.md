# Argus AI — Security Model & Threat Matrix

ARGUS AI is designed around a zero-trust offensive-defensive evaluation loop for LLM systems. It maps vulnerabilities against both the **OWASP Top 10 for Large Language Model Applications (2025)** and the **MITRE ATLAS (Adversarial Threat Landscape for Artificial-Intelligence Systems)** framework.

---

## 1. OWASP Top 10 for LLM Mapping

| Identifier | Vulnerability Name | Risk Description in ARGUS | ARGUS Evaluation Engine | Remediation Runbook |
|:---|:---|:---|:---|:---|
| **LLM01** | Prompt Injection (Direct & Indirect) | Attacker manipulates model instructions via user prompt or retrieved RAG context. | Canary token injection, DAN jailbreak vectors, RAG chunk smuggling. | Strict semantic firewalls (LlamaGuard/NeMo), delimiter isolation, structural JSON schemas. |
| **LLM02** | Sensitive Information Disclosure | Model outputs proprietary intellectual property, API keys, or PII. | Regex signature scans for AWS/Stripe keys, SQL passwords, and canary markers. | Pre-computation data scrubbers, anonymization layers, regex egress filtering. |
| **LLM04** | Model Denial of Service | Complex context flooding or algorithmic loops leading to exhaustion. | Token volume stress tests, context window saturation probes. | Strict token rate-limiting, context cutoff bounds, concurrency caps. |
| **LLM06** | Excessive Agency | Model granted autonomous tool invocation without user authorization. | Automated invocations of `send_email` and `search_database` with untrusted params. | Human-in-the-loop approvals for external side-effects, least-privilege tool access. |
| **LLM07** | System Prompt Disclosure | Leakage of internal system directives and guardrail boundaries. | Verbatim instruction extraction vectors ("Repeat everything above..."). | Hard system prompt demarcation, semantic intent refusal filters. |
| **LLM08** | Vector & Embedding Weaknesses | RAG document store poisoned with adversarial directives. | Multi-chunk PDF ingestion into FAISS/ChromaDB with poisoned guidance. | Authenticated document ingestion, cosine similarity anomaly detection. |

---

## 2. MITRE ATLAS Matrix Integration

ARGUS tracks and indexes attacks along the MITRE ATLAS adversary lifecycle:

- **Reconnaissance**: Discovering model endpoint metadata, temperature, and tool schema signatures.
- **Resource Development**: Synthesizing context-tailored jailbreak variants using Jinja2 prompt mutators.
- **Initial Access (AML.T0054)**: Submitting adversarial prompt payloads across HTTP REST endpoints.
- **Execution (AML.T0051)**: Executing indirect injection through poisoned knowledge bases.
- **Privilege Escalation (AML.T0058)**: Hijacking tool reasoning to execute unintended database or email commands.
- **Exfiltration (AML.T0057)**: Siphoning sensitive database records or credentials in generated response tokens.

---

## 3. Defense-in-Depth Mechanisms

ARGUS features a live, switchable guardrail engine on the Target Chatbot:
1. **Level 0 (Disabled / Vulnerable)**: Zero sanitization. Prompts execute directly against the LLM with tool capabilities exposed.
2. **Level 1 (Semantic Guardrail / LlamaGuard)**:
   - Ingress filtering checks for adversarial phrases, override directives, and known jailbreaks.
   - Refuses malicious requests with structured policy violation code `REF-904`.
   - Tool arguments are validated before side-effects can be dispatched.

