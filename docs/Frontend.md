# Argus AI — Frontend & SOC Security Dashboard

The **Frontend** of ARGUS AI is a professional Cyber Defense / SOC Command Center built with **React 18**, **TypeScript**, and **Vite**. It gives security analysts and penetration testers full visibility into target AI architectures, live attacks, attack path trees, and compliance posture.

---

## 1. Design System & User Experience

- **Theme & Aesthetics**: Dark cyber-defense aesthetic featuring deep navy/black backgrounds (`#0a0a0c`), restrained red brand accent (`#ef4444`), cyan telemetry highlights (`#38bdf8`), and amber alerts (`#f59e0b`).
- **Typography**: Clean, monospace-assisted hierarchy using `Plus Jakarta Sans` and `Fira Code`.
- **Zero Mock UI**: Real live REST and WebSocket connections to the Target Chatbot, FastAPI Gateway, and Neo4j Digital Twin. Real binary blob file downloads for PDF dossiers.

---

## 2. Core Views & Capabilities

### 1. Target Chatbot Lab (`/target-chatbot`)
- **Direct & Indirect Injection Testing**: Interactive conversational interface interacting with the target LLM on port 7003.
- **RAG Knowledge Ingestion**: Upload PDF documents directly into the FAISS vector database to simulate data poisoning.
- **Defense Switcher**: Toggle real-time target defenses:
  - *Disabled (Level 0)*: Zero-defense unmoderated inference where DAN jailbreaks and system leaks succeed.
  - *LlamaGuard / NeMo (Level 1)*: Active semantic firewall that blocks prompt injections and unsafe tool invocations with `REF-904` directives.
- **Live Security Telemetry Drawer**: Displays step-by-step token evaluation, canary detection, and multi-hop indicators.

### 2. Digital Twin Topology (`/digital-twin`)
- **Interactive Graph**: Interactive network canvas powered by React Flow rendering Attacker nodes, Prompt ingress, Chatbot engines, Tools, and Vector stores.
- **Path Highlighting**: Highlights compromised routes in red when high-severity attacks succeed.
- **List / Matrix View Toggle**: Seamless view switching between visual graph layout and structured tabular node inventory.

### 3. Attack Paths & Exploit Tree (`/attack-paths`)
- Multi-hop traversal visualizer illustrating how an adversary chains indirect prompt injection into an unsafe email or database dispatch.

### 4. Vulnerability Matrix (`/vulnerabilities`)
- Categorized breakdown of identified flaws indexed by OWASP LLM Top 10 and MITRE ATLAS matrices, with severity ratings and CVSS scores.

### 5. Security Scans Console (`/scans`)
- Launch autonomous multi-phase red team assessments against any target endpoint.
- Live progress bar, step log streams, and direct PDF report download modal.

### 6. Executive Reports & Audits (`/reports`)
- Generates and downloads real ReportLab PDF dossiers with executive summaries, CVSS scoreboards, and mitigation runbooks.

---

## 3. Build & Deployment

To run in development mode:
```bash
cd frontend
npm install
npm run dev
```

To create an optimized production build:
```bash
npm run build
```
The build artifacts are output to `frontend/dist/` and can be served via Nginx or static file server.

