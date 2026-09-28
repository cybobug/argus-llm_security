# Argus AI — Backend Gateway & Orchestrator

The **Backend Gateway** is a high-performance **FastAPI** application running on port **8000**. It acts as the central control plane for ARGUS AI, coordinating user authentication, scan job dispatching, real-time packet telemetry, database persistence, and CISO executive PDF report generation.

---

## 1. Architectural Role

```
   ┌─────────────────────────────────────────────────────────┐
   │                   React SOC Frontend                    │
   └────────────────────────────┬────────────────────────────┘
                                │ HTTP / WebSockets
                                ▼
   ┌─────────────────────────────────────────────────────────┐
   │                  FastAPI Backend Gateway                │
   │                        (Port 8000)                      │
   ├────────────────────────────┬────────────────────────────┤
   │ • Auth & RBAC (JWT)        │ • Scan Job Dispatcher      │
   │ • SQLAlchemy 2.0 Async ORM │ • Live Packet Sniffer      │
   │ • SQLite / PostgreSQL      │ • ReportLab PDF Generator  │
   └──────┬─────────────────────┴──────┬─────────────────────┘
          │                            │
          ▼                            ▼
   ┌──────────────┐             ┌──────────────┐
   │ Attack Engine│             │ Digital Twin │
   │ (Port 7002)  │             │ (Port 7001)  │
   └──────────────┘             └──────────────┘
```

---

## 2. Core Modules

- **`app/main.py`**:
  Application bootstrap, CORS configuration, router registrations, and lifecycle management.
- **`app/routes/`**:
  - `auth.py`: User registration, password hashing (bcrypt), and OAuth2 Bearer token generation.
  - `scan.py`: Scan triggering, background worker queue, status polling, and attack history lookup.
  - `report.py`: On-demand PDF report compilation and streaming download endpoints.
  - `graph.py`: Proxy route forwarding to the Digital Twin Neo4j service.
  - `dashboard.py`: Summary metrics calculation (mean CVSS score, posture rating, vulnerability breakdown).
  - `network.py`: Live network telemetry WebSocket endpoint.
- **`app/services/`**:
  - `orchestrator.py`: Dispatches execution tasks to the Attack Engine and correlates responses.
  - `report_generator.py`: Generates publication-ready PDF audit dossiers using ReportLab.
  - `packet_sniffer.py`: Background packet listener using Scapy for live payload inspection.
- **`app/database/`**:
  - `connection.py`: Async engine and session factory (`sqlite+aiosqlite:///./argus.db`).
  - `crud.py`: Database access layer for users, scan jobs, attack results, and reports.
  - `models/db_models.py`: Declarative SQLAlchemy schemas for `User`, `ScanJob`, `AttackResult`, `Report`.

---

## 3. PDF Report Generation Flow

ARGUS AI features a native **ReportLab** PDF generation engine:
1. When a scan finishes or an audit download is requested, `report_generator.generate_pdf()` constructs a `SimpleDocTemplate`.
2. It generates:
   - **Executive Header**: Severity badge, overall posture score (0–100), and scan metadata.
   - **Risk Score Breakdown**: Table summarizing attacks conducted, vulnerabilities identified, and critical chokepoints.
   - **Detailed Forensic Traces**: Table of individual attack iterations with full prompt, target response, and severity evaluation.
   - **Remediation Runbook**: Step-by-step guidance referencing OWASP and NIST mitigation standards.
3. The report is saved to `./reports/` and served via `GET /report/{scan_id}` or `GET /report/sample/{template_id}` as `application/pdf`.

---

## 4. Verification & Testing

To run the backend test suite:
```bash
cd backend
source venv/bin/activate
PYTHONPATH=./app pytest tests/ -v
```
All tests verify authentication, database CRUD operations, and report generation workflows.

