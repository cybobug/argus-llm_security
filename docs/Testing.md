# Argus AI — Testing & Quality Assurance

This document details test coverage, test runner configurations, and verification procedures across all ARGUS AI services.

---

## 1. Test Suite Summary (72/72 Tests Passing)

| Subsystem | Framework | Test Directory | Tests Count | Status |
|:---|:---|:---|:---|:---|
| **Attack Engine** | pytest / pytest-asyncio | `attack-engine/tests/` | 46 passed | ✅ PASS |
| **Target Chatbot** | pytest | `chatbot/test_chatbot.py` | 7 passed | ✅ PASS |
| **Digital Twin** | pytest | `digital-twin/tests/` | 10 passed | ✅ PASS |
| **Backend Gateway** | pytest / pytest-asyncio | `backend/app/tests/` | 9 passed | ✅ PASS |
| **Frontend** | Vite + TypeScript | `frontend/` (`npm run build`) | Zero TS errors (1490 modules) | ✅ PASS |

---

## 2. Running the Test Suites

### 1. Attack Engine
```bash
cd attack-engine
source venv/bin/activate
pytest tests/ -v
```
**Coverage Highlights**:
- Prompt generator Jinja2 rendering across all attack categories.
- Canary word detector with case-insensitive token boundaries.
- Response analyzer scoring logic and regex matchers.
- Executor retry and error handling.

### 2. Backend Gateway
```bash
cd backend
source venv/bin/activate
PYTHONPATH=./app pytest tests/ -v
```
**Coverage Highlights**:
- User registration and JWT bearer token issuance.
- Scan job state machine transitions (pending ➔ running ➔ completed).
- CRUD operations for attack results and scan persistence.
- ReportLab PDF generator construction and file output validation.

### 3. Digital Twin Service
```bash
cd digital-twin
pytest tests/ -v
```
**Coverage Highlights**:
- Node creation and label classification.
- Shortest-path exploit graph computation.
- In-memory graph fallback when Neo4j is offline.

### 4. Frontend Typecheck & Build
```bash
cd frontend
npm run build
```
Verifies that all TypeScript components, routing, Lucide icon imports, and styling bundle successfully without runtime or compilation errors.

