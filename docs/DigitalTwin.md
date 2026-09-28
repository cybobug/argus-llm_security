# Argus AI — Digital Twin & Attack Surface Graph

The **Digital Twin** module models an enterprise AI application's complete runtime attack surface as a connected graph inside **Neo4j** (with an in-memory networkx/dict fallback). It enables graph-theoretic vulnerability discovery, reachability analysis, and shortest exploit path computation using Cypher queries.

---

## 1. Graph Ontology & Schema

The graph is composed of 6 standard entity types and directional edges:

```
               ┌───────────────┐
               │   Attacker    │
               └───────┬───────┘
                       │ (CAN_ACCESS)
                       ▼
               ┌───────────────┐
               │ Prompt Input  │
               └───────┬───────┘
                       │ (FEEDS_INTO)
                       ▼
               ┌───────────────┐
               │ Chatbot (LLM) │
               └───┬───────┬───┘
                   │       │
    (RETRIEVES_FROM)│       │(INVOKES)
                   ▼       ▼
    ┌────────────────┐   ┌────────────────┐
    │  Vector Store  │   │      Tool      │
    │  (Chroma/FAISS)│   │  (SendEmail,   │
    └────────────────┘   │  SearchDB)     │
                         └───────┬────────┘
                                 │ (CONNECTS_TO)
                                 ▼
                         ┌────────────────┐
                         │ Database / Sink│
                         │ (SQL / SMTP)   │
                         └────────────────┘
```

### Node Types
1. `Attacker`: Untrusted external input source or authenticated user.
2. `Prompt`: Attack entry point (HTTP POST endpoint, web input form, webhook).
3. `Chatbot`: The target LLM reasoning engine (e.g. GPT-4o, Gemini Flash, Claude).
4. `VectorStore`: Document embedding repository (FAISS index, ChromaDB collection).
5. `Tool`: Executable functions exposed to the model (`send_email`, `search_database`).
6. `Database`: Backend persistent data storage containing sensitive records or credentials.

### Relationship Types
- `CAN_ACCESS`: Adversary capability to submit input to a prompt node.
- `FEEDS_INTO`: Prompt data forwarded into the LLM context window.
- `RETRIEVES_FROM`: Model pulls unvetted external document chunks into reasoning prompt.
- `INVOKES`: LLM autonomy to call an external tool with model-generated arguments.
- `CONNECTS_TO`: Tool side-effect reaches a critical system or data sink.

---

## 2. Core Service Endpoints (Port 7001)

- `POST /build-graph`:
  Initializes or updates the digital twin topology in Neo4j with nodes and edges.
- `GET /graph`:
  Returns the serialized graph structure in React Flow format:
  ```json
  {
    "nodes": [
      { "id": "attacker-1", "label": "External Adversary", "type": "Attacker", "status": "active" },
      { "id": "chatbot-1", "label": "Argus Enterprise Assistant", "type": "Chatbot", "status": "vulnerable" },
      { "id": "tool-1", "label": "send_email()", "type": "Tool", "status": "critical" }
    ],
    "edges": [
      { "id": "e1", "source": "attacker-1", "target": "chatbot-1", "label": "CAN_ACCESS" },
      { "id": "e2", "source": "chatbot-1", "target": "tool-1", "label": "INVOKES" }
    ]
  }
  ```
- `GET /attack-paths`:
  Executes path traversal to locate all viable multi-hop attack routes from an `Attacker` node to high-value `Database` or `Sink` nodes.
- `GET /risk`:
  Calculates aggregate blast radius and structural centrality scores (PageRank / Degree Centrality).
- `GET /critical-nodes`:
  Returns the top bottleneck nodes whose compromise leads to systemic compromise.

---

## 3. Cypher Traversal Queries

### Exploit Path Discovery
```cypher
MATCH path = (a:Attacker)-[:CAN_ACCESS|FEEDS_INTO|RETRIEVES_FROM|INVOKES|CONNECTS_TO*1..5]->(d:Database)
RETURN path, length(path) AS hops
ORDER BY hops ASC
```

### High-Centrality Chokepoint Identification
```cypher
MATCH (c:Chatbot)-[r:INVOKES]->(t:Tool)
WHERE t.requires_auth = false
RETURN c.name AS VulnerableAgent, t.name AS UnsafeTool, count(r) AS Degree
```

---

## 4. Verification & Testing

To verify the Digital Twin service:
```bash
cd digital-twin
pytest tests/ -v
```
Tests validate node creation, graph serialization, shortest-path calculation, and fallback to in-memory graph when Neo4j credentials are not configured.

