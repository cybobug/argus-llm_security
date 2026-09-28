# Argus AI — Deployment & Service Orchestration

This guide outlines how to deploy and run all components of ARGUS AI locally or in containerized environments.

---

## 1. System Services Overview

| Service Name | Technology | Default Port | Primary Function |
|:---|:---|:---|:---|
| **SOC Frontend** | React 18 / Vite | `5173` | SOC visual dashboard & penetration testing lab |
| **Backend Gateway** | FastAPI / Python 3.10+ | `8000` | Orchestration, auth, and ReportLab PDF reporting |
| **Digital Twin** | FastAPI / Neo4j | `7001` | Attack surface topology and Cypher exploit routing |
| **Attack Engine** | FastAPI / LangGraph | `7002` | Autonomous red team planner & canary evaluator |
| **Target Chatbot** | FastAPI / FAISS | `7003` | RAG enterprise target with toggleable defenses |

---

## 2. Quick Start Script (`start.sh`)

ARGUS AI includes an automated start script in the repository root that starts all services in parallel:

```bash
chmod +x start.sh
./start.sh
```

To stop all running services:
```bash
./stop.sh   # Or kill processes listening on ports 5173, 8000, 7001, 7002, 7003
```

---

## 3. Manual Step-by-Step Launch

### Terminal 1: Target Chatbot (Port 7003)
```bash
cd chatbot
../attack-engine/venv/bin/python3 main.py
```

### Terminal 2: Digital Twin (Port 7001)
```bash
cd digital-twin
python3 main.py
```

### Terminal 3: Attack Engine (Port 7002)
```bash
cd attack-engine
source venv/bin/activate
python3 main.py
```

### Terminal 4: Backend Gateway (Port 8000)
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Terminal 5: SOC Dashboard (Port 5173)
```bash
cd frontend
npm run dev
```

---

## 4. Environment Variables Configuration

Create a `.env` file in the project root:

```env
# Target Chatbot & Attack Engine LLM Keys
GEMINI_API_KEY="your-google-gemini-api-key"
GEMINI_MODEL="gemini-1.5-flash"

# Backend Gateway Config
SECRET_KEY="your-jwt-secret-key-at-least-32-chars"
DATABASE_URL="sqlite+aiosqlite:///./argus.db"
REPORTS_DIR="./reports"

# Digital Twin Neo4j Config (Optional - in-memory fallback enabled if missing)
NEO4J_URI="bolt://localhost:7687"
NEO4J_USER="neo4j"
NEO4J_PASSWORD="password"
```

