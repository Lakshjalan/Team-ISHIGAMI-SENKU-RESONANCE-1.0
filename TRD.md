# SYNTRA — Technical Requirements Document (TRD)
## Technical Architecture & Implementation Blueprint
**Hackathon Development Reference**

---

## 1. System Overview & Technology Stack

SYNTRA is built on a modern, decoupled client-server architecture designed for high performance, real-time data ingestion, intelligent entity matching, and transparent human-in-the-loop review.

### Core Stack Matrix
| Component | Technology | Primary Role |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 18** (Vite build engine) | Single Page Application (SPA) with optimistic UI updates and Skeleton Loaders |
| **Build & Bundler** | **Vite** (`vite.config.js`) | Fast ESM dev server, optimized production bundling, proxy configuration |
| **Backend Framework** | **Node.js (v18+) + Express.js** | RESTful API routes, orchestration engine, file parsing, business logic |
| **Database & Auth** | **Supabase** (PostgreSQL + Realtime + Storage) | Persistence layer, JSONB raw payloads, real-time conflict subscription |
| **Caching Layer** | **Redis** (via `ioredis` / Upstash Redis) | Caching match calculations, normalization lookups, rate limiting |
| **ML & AI Engine** | **Hybrid Pipeline** (Python / Scikit-learn / XGBoost + Custom LLM Model) | Feature extraction, fuzzy matching, match probability scoring, LLM reasoning |
| **UI Loading UX** | **Tailwind CSS + Skeleton Loaders** | Shimmer states for smooth asynchronous data fetching |

---

## 2. System Architecture & Component Design

```
                     ┌─────────────────────────────────────────────────────────┐
                     │                   React Client (Vite)                   │
                     │  ┌──────────────────┬────────────────────────────────┐  │
                     │  │ Core Dashboard   │ Data Upload & Normalization    │  │
                     │  │ Conflict Review  │ Master Records & Audit History │  │
                     │  └──────────────────┴────────────────────────────────┘  │
                     │  ┌──────────────────────────────────────────────────┐  │
                     │  │ Skeleton Loaders & UI Shimmers (TanStack Query)  │  │
                     │  └──────────────────────────────────────────────────┘  │
                     └────────────────────────────┬────────────────────────────┘
                                                  │ REST API / WebSocket (Realtime)
                                                  ▼
                     ┌─────────────────────────────────────────────────────────┐
                     │                   Express.js Backend                    │
                     │  ┌─────────────────┬─────────────────────────────────┐  │
                     │  │ Ingestion Route │ Conflict & Resolution Service   │  │
                     │  │ Matching Engine │ Audit Trail & Analytics Service │  │
                     │  └─────────────────┴─────────────────────────────────┘  │
                     └───────────────┬─────────────────────────┬───────────────┘
                                     │                         │
            ┌────────────────────────┼─────────────────────────┼────────────────────────┐
            ▼                        ▼                         ▼                        ▼
┌────────────────────────┐  ┌─────────────────┐       ┌─────────────────┐      ┌─────────────────┐
│     Supabase DB        │  │   Redis Cache   │       │   ML-ER Model   │      │ Custom LLM Layer│
│  (PostgreSQL + JSONB)  │  │ (ioredis Engine)│       │ (XGBoost/Fuzzy) │      │(Explainability) │
├────────────────────────┤  ├─────────────────┤       ├─────────────────┤      ├─────────────────┤
│ Sources & Records      │  │ Match Cache     │       │ Pairwise Scorer │      │ Conflict        │
│ Matches & Conflicts    │  │ Normalization   │       │ Feature Matrix  │      │ Explanation &   │
│ Master & Audit Logs    │  │ Session Store   │       │ Distance Metrics│      │ Evidence Text   │
└────────────────────────┘  └─────────────────┘       └─────────────────┘      └─────────────────┘
```

---

## 3. Machine Learning & Intelligence Model Architecture

To achieve accurate entity resolution and explainable reconciliation, SYNTRA uses a 3-tier hybrid intelligence pipeline.

### Tier 1: Deterministic Normalization & Feature Extraction
- **Name Normalization**: Lowercase conversion, title removal (`Mr.`, `Dr.`), whitespace stripping, accent removal, token sorting.
- **Phone Normalization**: E.164 standardization, country code stripping (`+91`, `0`), digit extraction.
- **Email Normalization**: Domain lowercase, dot-stripping for Gmail addresses (`r.ahul` → `rahul`), aliasing removal (`+tag`).
- **Feature Vector Generation**: For candidate record pairs $(R_A, R_B)$, calculate a similarity feature vector $\vec{x}$:
  - $x_1$: Jaro-Winkler distance on Name
  - $x_2$: Levenshtein distance on Name tokens
  - $x_3$: Phonetic match boolean (Double Metaphone / Soundex)
  - $x_4$: Exact Phone match boolean
  - $x_5$: Exact Email match boolean
  - $x_6$: Domain / Department string similarity (Jaccard / Cosine Similarity)

### Tier 2: Supervised Pairwise ML Matcher (XGBoost / Random Forest)
- **Model Type**: Supervised Binary Classification (`is_duplicate: 0 | 1`) / Logistic Regression / XGBoost Classifier.
- **Probability Output**: Match Confidence Score $C_{match} \in [0.0, 1.0]$.
- **Decision Thresholds**:
  - **Auto-Resolve ($C_{match} \ge 0.90$)**: System automatically links records and generates a Master Record.
  - **Human Review ($0.75 \le C_{match} < 0.90$)**: Record pair is flagged and added to the Supabase conflict review queue.
  - **No Match ($C_{match} < 0.75$)**: Records treated as distinct real-world entities.

### Tier 3: LLM Conflict Arbitrator & Natural Language Explainer (Custom In-House LLM Model)
- **Role**: When field conflicts occur, an LLM prompt is constructed with source reliability metadata, field values, and agreement counts.
- **Output**: Structured JSON containing:
  - Recommended field value.
  - Natural language reasoning text for non-technical users.
  - Field confidence breakdown score.

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 `sources`
Registers data origins and their baseline trust weighting.
```sql
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  reliability_score FLOAT NOT NULL CHECK (reliability_score BETWEEN 0 AND 1),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.2 `raw_records`
Stores original, unmodified data payloads.
```sql
CREATE TABLE raw_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  external_id VARCHAR(255),
  raw_payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 `normalized_records`
Cleaned attributes used by the ML feature generator.
```sql
CREATE TABLE normalized_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_record_id UUID REFERENCES raw_records(id) ON DELETE CASCADE,
  norm_name VARCHAR(255),
  norm_email VARCHAR(255),
  norm_phone VARCHAR(50),
  norm_department VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.4 `matches`
Candidate pair match scores.
```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_a_id UUID REFERENCES raw_records(id),
  record_b_id UUID REFERENCES raw_records(id),
  match_score FLOAT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'auto_resolved', 'human_review', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.5 `conflicts`
Field-level disagreements requiring evaluation.
```sql
CREATE TABLE conflicts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  competing_values JSONB NOT NULL, -- Array of { source_id, value, reliability }
  recommended_value TEXT,
  final_value TEXT,
  confidence FLOAT,
  reasoning TEXT,
  status VARCHAR(50) DEFAULT 'human_review' CHECK (status IN ('auto_resolved', 'human_review', 'manually_resolved')),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.6 `master_records`
The unified, golden entity records.
```sql
CREATE TABLE master_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_cluster_id UUID NOT NULL,
  unified_attributes JSONB NOT NULL,
  overall_confidence FLOAT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.7 `audit_history`
Immutable decision ledger preserving source lineage.
```sql
CREATE TABLE audit_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  master_record_id UUID REFERENCES master_records(id) ON DELETE CASCADE,
  field_name VARCHAR(100) NOT NULL,
  previous_value TEXT,
  selected_value TEXT NOT NULL,
  source_id UUID REFERENCES sources(id),
  decision_type VARCHAR(50) NOT NULL CHECK (decision_type IN ('auto_resolved', 'human_accepted', 'human_overridden')),
  confidence FLOAT NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 5. Caching Strategy (Redis)

Redis is integrated via `ioredis` to reduce DB reads and accelerate batch ML feature computation.

### Redis Use Cases & Key Patterns:
1. **Normalization Lookups (`norm:{hash}`)**: Cache normalized strings for duplicate detection (TTL: 24h).
2. **Match Score Cache (`match:{recA}:{recB}`)**: Cache pairwise ML similarity vectors and score calculations (TTL: 12h).
3. **Dashboard Metrics Cache (`analytics:dashboard`)**: Cache aggregate statistics (Total Records, Conflicts Pending, Master Records Count) for instant dashboard renders (TTL: 5m, invalidated on resolution mutation).
4. **API Rate Limiting (`rate:{ip}`)**: Sliding window rate limiting on ingestion endpoints.

---

## 6. Frontend Architecture & Skeleton Loading UX

### 6.1 Framework & Vite Configuration (`vite.config.js`)
```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

### 6.2 UI State Management & Skeleton Loaders
To ensure seamless visual transitions during async operations (data ingestion, match calculations, fetching audit histories), React components implement custom Shimmer/Skeleton Loaders using Tailwind CSS.

- **`DashboardSkeleton`**: Rendered while loading aggregate counts and recent activity graphs.
- **`ConflictCardSkeleton`**: Rendered in the Human-in-the-Loop review queue while fetching AI explanations and source evidence.
- **`MasterTableSkeleton`**: Rendered while paginating through master entities.
- **`AuditTimelineSkeleton`**: Rendered when inspecting decision histories.

---

## 7. API Specification (Express.js Backend)

| Method | Endpoint | Description | Cache Behavior |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/sources` | Register a new dataset source & reliability rating | N/A |
| `POST` | `/api/ingest` | Upload & parse structured CSV data files | Invalidates dashboard cache |
| `POST` | `/api/reconcile/run` | Execute normalization, ML matching, and conflict engine | Invalidates match cache |
| `GET` | `/api/conflicts` | Fetch pending conflicts for human review | Reads from DB / Supabase Realtime |
| `POST` | `/api/conflicts/:id/resolve` | Submit human approval / override for a conflict | Updates DB, logs Audit, invalidates cache |
| `GET` | `/api/master-records` | Fetch paginated golden master records | Redis cache (5 min TTL) |
| `GET` | `/api/master-records/:id/audit` | Fetch complete provenance & audit trail for an entity | DB query with JOIN on `sources` |

---

## 8. Development Implementation Plan

```
Phase 1: Foundation
├── Supabase schema setup & migration scripts
├── Redis instance connection setup
└── Vite + React + Tailwind + Skeleton Component scaffolding

Phase 2: Engine & Ingestion
├── CSV Upload & Parsing service (Express + Multer + PapaParse)
├── Normalization & Feature Generator module
└── Algorithmic / ML-ER Matching service implementation

Phase 3: Conflict & AI Layer
├── Conflict Detection & Scoring pipeline
├── Custom In-House LLM Model Integration for NL Explanations
└── Supabase Realtime connection for conflict queue updates

Phase 4: Frontend & UX
├── Dashboard with Skeleton Fallbacks
├── Interactive Conflict Review Queue (Accept/Override/Edit)
└── Master Record & Immutable Audit History Timeline
```
