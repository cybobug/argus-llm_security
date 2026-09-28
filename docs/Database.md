# Argus AI — Database Architecture

ARGUS AI uses a dual-database architecture to support relational scan auditing and graph-theoretic attack surface exploration:

1. **Relational Database**: **SQLite** (development/demo) or **PostgreSQL** (production) managed via **SQLAlchemy 2.0 Async ORM** and **aiosqlite** / **asyncpg**.
2. **Graph Database**: **Neo4j** (managed via `neo4j` Python driver) for digital twin modeling and Cypher path queries, with an in-memory fallback.

---

## 1. Relational Schema (SQLite / PostgreSQL)

```
┌────────────────────────────────┐
│             users              │
├────────────────────────────────┤
│ id (PK, String)                │
│ email (String, Unique)         │
│ hashed_password (String)       │
│ created_at (DateTime)          │
└──────────────┬─────────────────┘
               │ 1
               │
               │ N
┌──────────────▼─────────────────┐        1 ┌────────────────────────────────┐
│           scan_jobs            ├──────────►            reports             │
├────────────────────────────────┤          ├────────────────────────────────┤
│ id (PK, String)                │          │ id (PK, String)                │
│ user_id (FK -> users.id)       │          │ scan_id (FK -> scan_jobs.id)   │
│ project_name (String)          │          │ file_path (String)             │
│ target_url (String)            │          │ created_at (DateTime)          │
│ status (String: pending/done)  │          └────────────────────────────────┘
│ started_at (DateTime)          │
│ finished_at (DateTime, Nullable│
└──────────────┬─────────────────┘
               │ 1
               │
               │ N
┌──────────────▼─────────────────┐
│         attack_results         │
├────────────────────────────────┤
│ id (PK, String)                │
│ scan_id (FK -> scan_jobs.id)   │
│ category (String)              │
│ prompt (Text)                  │
│ response (Text)                │
│ score (Float: 0-100)           │
│ timestamp (DateTime)           │
└────────────────────────────────┘
```

---

## 2. Graph Schema (Neo4j)

### Node Labels
- `:Attacker { id: String, label: String, source_ip: String }`
- `:Prompt { id: String, label: String, endpoint: String, method: String }`
- `:Chatbot { id: String, label: String, model: String, temperature: Float }`
- `:VectorStore { id: String, label: String, engine: String, document_count: Int }`
- `:Tool { id: String, label: String, requires_auth: Boolean, action: String }`
- `:Database { id: String, label: String, data_classification: String }`

### Directed Relationships
- `(Attacker)-[:CAN_ACCESS]->(Prompt)`
- `(Prompt)-[:FEEDS_INTO]->(Chatbot)`
- `(Chatbot)-[:RETRIEVES_FROM]->(VectorStore)`
- `(Chatbot)-[:INVOKES]->(Tool)`
- `(Tool)-[:CONNECTS_TO]->(Database)`

---

## 3. Database Initialization & Migration

The relational database tables are created automatically on startup by `init_db()` in `app/database/connection.py`.

To manually inspect or query the SQLite database:
```bash
sqlite3 backend/argus.db ".tables"
sqlite3 backend/argus.db "SELECT id, project_name, status FROM scan_jobs;"
```

