# Veritas ER / RECONCILE.AI — Team Roles & Codebase Boundaries

Welcome to the team role matrix for **Veritas ER / RECONCILE.AI**. To ensure seamless parallel development without merge conflicts, the codebase is divided across **4 roles** spanning 3 primary technical domains: Frontend (2 engineers), Backend + Database (1 engineer), and ML / AI Engine (1 engineer).

---

## 👥 Team Role Matrix

| Role | Role Title | Primary Focus | Dedicated Specification File |
| :--- | :--- | :--- | :--- |
| **Frontend 1** | Ingestion, Auth & Shared UI Lead | Drag-and-drop upload, authentication, data source cards, Navbar/Sidebar layout, Tailwind base theme | 📄 [role_frontend_1.md] |
| **Frontend 2** | Review Queue, Audit & Analytics Lead | Human-in-the-loop review queue, side-by-side field diffs, audit ledger timeline, confidence badges, dashboard | 📄 [role_frontend_2.md] |
| **Backend & DB** | Express API, Database & System Lead (Laksh) | Supabase PostgreSQL schema, Express REST routes, Redis cache, SHA-256 audit ledger, pipeline orchestrator | 📄 [role_backend_db.md]|
| **ML & AI** | Matching Engine & LLM Arbitrator Lead | Candidate pair blocking, feature vectors, XGBoost pairwise matcher ($C_{match}$), Gemini API reasoning | 📄 [role_ml_model.md] |

---

## 📁 Repository Ownership Map

```text
Resonance/
├── ROLES.md                             <-- Master Role Index (All Roles)
├── roles/
│   ├── role_frontend_1.md               <-- Frontend 1 Specification
│   ├── role_frontend_2.md               <-- Frontend 2 Specification
│   ├── role_backend_db.md               <-- Backend + DB Specification (Laksh)
│   └── role_ml_model.md                 <-- ML & AI Specification
│
├── frontend/                            <-- FRONTEND DOMAIN
│   ├── src/
│   │   ├── App.jsx                      <-- Shared Routing (FE1 & FE2)
│   │   ├── index.css                    <-- Shared Design System (FE1)
│   │   ├── pages/
│   │   │   ├── Login.jsx                <-- FE1 (Auth)
│   │   │   ├── Upload.jsx               <-- FE1 (Ingestion)
│   │   │   ├── Dashboard.jsx            <-- FE2 (Analytics)
│   │   │   ├── ReviewQueue.jsx          <-- FE2 (Conflict Triage)
│   │   │   └── AuditHistory.jsx         <-- FE2 (Audit Ledger)
│   │   ├── components/
│   │   │   ├── Navbar.jsx               <-- FE1 (Layout)
│   │   │   ├── Sidebar.jsx              <-- FE1 (Layout)
│   │   │   ├── UploadBox.jsx            <-- FE1 (Dropzone UI)
│   │   │   ├── SourceCard.jsx           <-- FE1 (Source Metadata)
│   │   │   ├── ReviewCard.jsx           <-- FE2 (Field Diff & LLM Card)
│   │   │   ├── ConfidenceBadge.jsx      <-- FE2 (Triage Score Badges)
│   │   │   └── AuditTimeline.jsx        <-- FE2 (Cryptographic Timeline)
│   │   └── services/
│   │       └── api.js                   <-- FE1 & FE2 API Client
│
├── backend/                             <-- BACKEND & DB DOMAIN (Laksh)
│   ├── src/
│   │   ├── server.js                    <-- Express server entry point
│   │   ├── routes/                      <-- API Route Handlers (upload, review, entity)
│   │   ├── controllers/                 <-- Ingestion, Review & Master Record controllers
│   │   ├── services/
│   │   │   ├── auditService.js          <-- Cryptographic SHA-256 Ledger
│   │   │   ├── normalizationServices.js <-- Text, Email, Phone Standardizers
│   │   │   ├── entityResolutionService.js <-- Pipeline Orchestrator
│   │   │   ├── blockingService.js       <-- Node wrapper for ML Blocking
│   │   │   └── llmArbitrator.js         <-- Node wrapper for Gemini API
│   │   └── config/                      <-- Supabase & Redis client initializers
│   └── db/
│       └── schema.sql                   <-- Supabase PostgreSQL Schema & pg_trgm indexes
│
└── ml/                                  <-- MACHINE LEARNING DOMAIN
    ├── requirements.txt                 <-- Python ML Dependencies
    ├── models/                          <-- Trained Model Artifacts (xgboost_entity_matcher.pkl)
    ├── notebooks/                       <-- Model Training & Benchmark Notebooks
    └── src/
        ├── blocking.py                  <-- Candidate Pair Generator
        ├── feature_extraction.py        <-- Jaro-Winkler, Levenshtein, Metaphone Metrics
        ├── pairwise_matcher.py          <-- Supervised ML Matcher (C_match scoring)
        └── llm_arbitrator.py            <-- Gemini API Prompt Engineering & Reasoning
```

---

## 🤝 Integration & Collaboration Protocol

1. **Frontend 1 ↔ Backend Handoff**:
   - `FE1` builds UI for dataset upload -> sends payload to `POST /api/upload`.
   - `Backend` processes raw records into Supabase `sources` & `raw_records` tables.

2. **Backend ↔ ML Engine Handoff**:
   - `Backend` sends raw record pairs to `ml/src/blocking.py` and `ml/src/pairwise_matcher.py`.
   - `ML Engine` evaluates feature vectors, computes $C_{match}$, and returns triage classification:
     - **$\ge 0.90$**: Auto-Merge
     - **$0.60–0.89$**: Send pair to `conflict_queue` + call Gemini API (`llm_arbitrator.py`) for natural language explanation.
     - **$< 0.60$**: Mark as distinct records.

3. **Backend ↔ Frontend 2 Handoff**:
   - `FE2` fetches pending pairs from `GET /api/review/queue`.
   - When human reviewer clicks Approve/Reject/Edit, `FE2` sends decision to `POST /api/review/resolve`.
   - `Backend` updates Supabase `master_records` and invokes `auditService.js` to write a new SHA-256 hash entry into `audit_ledger`.
