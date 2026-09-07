# Role Specification: Backend & Database Engineer
## Express API, Supabase Database, Redis Caching & System Orchestration

**Owner**: Laksh (Backend & DB Lead)  
**Domain**: Express.js REST APIs, Supabase PostgreSQL Database, Redis Caching, Audit Hash Ledger, Business Orchestration Engine  
**Architecture Reference**: [TRD.md](file:///c:/Users/laksh/Desktop/Resonance/TRD.md) | [architecture.md](file:///c:/Users/laksh/Desktop/Resonance/architecture.md)

---

## 1. Overview & Core Mission
The Backend & Database Engineer serves as the central orchestration pillar for **Veritas ER / RECONCILE.AI**. This role is responsible for designing the database schemas (Supabase/PostgreSQL), maintaining RESTful API endpoints, executing normalization pipelines, managing Redis caching, generating cryptographic SHA-256 audit ledgers, and bridging the React frontend with the ML matching model and Gemini LLM arbitrator engine.

---

## 2. Direct Folder & File Ownership

### 📁 Owned Files & Components
```text
backend/
├── src/
│   ├── server.js                        # Express app entry point, middleware, CORS, error handling
│   ├── routes/
│   │   ├── uploadRoutes.js              # Data ingestion & source registration API routes
│   │   ├── reviewRoutes.js              # Conflict review queue & resolution API routes
│   │   └── entityRoutes.js              # Golden Master Record & audit ledger API routes
│   ├── controllers/
│   │   ├── uploadController.js          # File parsing, record insertion & ingestion handling
│   │   ├── reviewController.js          # Conflict queue status, override processing & resolution logic
│   │   └── entityController.js          # Master record queries & audit verification controllers
│   ├── services/
│   │   ├── auditService.js              # Cryptographic SHA-256 hash chaining & ledger generator
│   │   ├── normalizationServices.js     # Text/email/phone standardizers in JS/Node
│   │   └── entityResolutionService.js   # Pipeline orchestrator (DB + ML + Cache + Audit)
│   └── config/                          # (To be created)
│       ├── supabase.js                  # Supabase database client initialization
│       └── redis.js                     # Redis cache connection configuration
├── db/                                  # Database migrations & schemas
│   └── schema.sql                       # PostgreSQL table definitions & pg_trgm index setup
├── package.json                         # Node dependencies & backend scripts
└── .env.example                         # Environment variable template
```

---

## 3. Key Responsibilities & Features

1. **Database Architecture & Supabase Integration (`db/schema.sql`, `config/supabase.js`)**
   - Design and maintain PostgreSQL schemas for core entity resolution tables:
     - `sources` (data origins & trust scores)
     - `raw_records` (original input records with JSONB payloads)
     - `candidate_pairs` (blocked record pairs for evaluation)
     - `conflict_queue` (ambiguous matches awaiting human review)
     - `master_records` (Golden Master Records)
     - `audit_ledger` (immutable SHA-256 change ledger)
   - Configure PostgreSQL extensions (e.g., `pg_trgm` for trigram similarity index).

2. **RESTful API Service (`server.js`, `routes/`, `controllers/`)**
   - Build robust Express.js API endpoints handling JSON/CSV data upload, conflict retrieval, resolution commits, and master record fetching.
   - Implement error handling middleware, input validation, and request logging.

3. **Cryptographic Audit Ledger Engine (`auditService.js`)**
   - Implement SHA-256 hash calculation for every record state change (creates, auto-merges, manual overrides).
   - Link each ledger entry to its previous hash ($H_n = \text{SHA256}(H_{n-1} + \text{RecordData} + \text{Timestamp})$) to guarantee tamper-evident integrity.
   - Provide time-travel queries enabling historical snapshot reconstruction of golden records.

4. **Redis Caching Layer (`config/redis.js`)**
   - Cache normalization results and similarity calculations in Redis to optimize response times for repeat records.
   - Implement rate-limiting middleware for API security.

5. **Pipeline Orchestration (`entityResolutionService.js`)**
   - Trigger normalization routines on incoming raw records.
   - Forward pre-processed candidate pairs to the ML Matching Engine.
   - Direct high-confidence pairs ($\ge 0.90$) to Auto-Merge, ambiguous pairs ($0.60–0.89$) to the `conflict_queue`, and low-confidence pairs ($<0.60$) to distinct record storage.

---

## 4. API & Integration Handoff Points

- **Exposes APIs to Frontend Engineers**:
  - `POST /api/upload` (Ingestion endpoint for FE1)
  - `GET /api/review/queue` & `POST /api/review/resolve` (Review endpoints for FE2)
  - `GET /api/entities/master` & `GET /api/entities/:id/audit` (Audit endpoints for FE2)
- **Integrates with ML Engineer**:
  - Calls Python ML inference endpoints or Node wrapper for Tier 1-2 Pairwise Matcher ($C_{match}$ scoring).
  - Invokes Tier 3 Gemini LLM Arbitrator service for conflicting field explanations.

---

## 5. Definition of Done (DoD)
- [ ] All PostgreSQL tables are created in Supabase with primary keys, foreign keys, and trigram indexes.
- [ ] Ingestion API successfully parses uploaded datasets and stores raw records.
- [ ] Audit Service generates valid SHA-256 hash chains upon record updates and verifies integrity.
- [ ] Redis caching successfully stores and retrieves match lookups.
- [ ] All Express API routes return standard JSON responses with status codes and error handling.
