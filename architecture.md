# Veritas ER — System Architecture

## 1. Architecture Overview

Veritas ER is an AI-assisted entity resolution and data governance system designed to consolidate records from multiple sources into a trusted **Master Golden Record** while detecting suspicious conflicts, preventing unsafe merges, and maintaining tamper-evident audit history.

The core pipeline is:

```text
LOGIN
  │
DASHBOARD
  │
UPLOAD DATA
  │
┌─┴───────────────┐
│                 │
SOURCE A        SOURCE B        SOURCE C
└────────┬────────┘
         │
         ▼
   NORMALIZATION
         │
         ▼
HIGH-RECALL CANDIDATE BLOCKING
        (pg_trgm)
         │
         ▼
LLM DATA ARBITRATOR
& REASONING ENGINE
         │
         ▼
┌───────────────────────────────────────────────┐
│             CONFIDENCE TRIAGE                │
├──────────────┬──────────────┬─────────────────┤
│ >= 0.90      │ 0.60–0.89    │ < 0.60         │
│ High         │ Ambiguous    │ Low / Suspicious│
│ confidence   │              │                 │
├──────────────┼──────────────┼─────────────────┤
│ Auto-Merge   │ Human Review │ Flag / Distinct │
└──────────────┴──────┬───────┴─────────────────┘
                       │
                 USER APPROVAL
                / OVERRIDE
                       │
                       ▼
             MASTER GOLDEN RECORD
                       │
                       ▼
          CRYPTOGRAPHIC AUDIT LEDGER
                    (SHA-256)
                       │
                       ▼
       INTEGRITY VERIFICATION & TIME-TRAVEL
```

---

## 2. Core Architectural Components

### 2.1 Data Ingestion

Users upload records from multiple sources.

Examples:

- Banking systems
- CRM exports
- Credit bureau feeds
- FinTech applications
- CSV/JSON datasets
- Internal enterprise databases

Each source should carry metadata such as:

- Source ID
- Source name
- Reliability/trust score
- Upload timestamp
- Record count
- Schema information

Example:

```json
{
  "source_id": "SRC_A",
  "source_name": "Core Banking",
  "reliability": 0.95
}
```

---

### 2.2 Normalization

Different systems may represent the same information differently.

Examples:

```text
"Rahul Sharma"
"rahul sharma"
"RAHUL SHARMA"

"+91 98765 43210"
"9876543210"

"rahul@gmail.com"
" Rahul@gmail.com "
```

Normalization converts these into a consistent representation before entity matching.

Typical operations:

- Trim whitespace
- Lowercase text
- Standardize phone numbers
- Normalize email casing/spacing
- Standardize dates
- Normalize names
- Handle missing/null values

Important: normalization should not destroy the original value. Store both:

```text
raw_value
normalized_value
```

This preserves provenance.

---

## 3. Candidate Blocking

### Problem

Comparing every record against every other record creates an expensive O(N²) comparison problem.

For example:

```text
1,000,000 records

Naive comparisons:
≈ 1,000,000 × 1,000,000
```

Instead, Veritas ER first identifies likely candidates.

### Proposed Technology

PostgreSQL `pg_trgm` can be used for fuzzy text similarity and candidate retrieval.

Potential blocking fields:

- Name
- Email
- Phone
- Address
- Date of birth

Example:

```text
Rahul Sharma
        ↓
Candidate Block
        ↓
Rahul Sharma
Rahul K Sharma
Rahul Sharma M
Rahul Sahrma
```

Only these candidates proceed to the expensive reasoning stage.

---

## 4. LLM Data Arbitrator & Reasoning Engine

The LLM should **not** blindly decide whether two records are identical.

It receives structured evidence from the matching layer.

Example input:

```json
{
  "entity_candidates": [
    {
      "source": "A",
      "name": "Rahul Sharma",
      "email": "rahul@gmail.com",
      "reliability": 0.95
    },
    {
      "source": "B",
      "name": "Rahul Sharma",
      "email": "rahul@gmail.com",
      "reliability": 0.85
    },
    {
      "source": "C",
      "name": "Rahul Sharma",
      "email": "rahul123@gmail.com",
      "reliability": 0.60
    }
  ]
}
```

The arbitrator evaluates:

- Field-level agreement
- Source reliability
- Attribute conflicts
- Historical values
- Pattern deviations
- Whether the records likely refer to the same entity
- Whether the conflict is suspicious
- Whether automatic merging is safe

The LLM should return structured output rather than unrestricted text.

---

## 5. Confidence Triage

The system uses configurable confidence thresholds.

### Tier 1 — High Confidence

```text
confidence >= 0.90
```

Potential action:

```text
AUTO-MERGE
```

This should only be enabled after validating/calibrating the threshold against representative data.

### Tier 2 — Ambiguous

```text
0.60 <= confidence < 0.90
```

Potential action:

```text
HUMAN REVIEW QUEUE
```

The system provides:

- Recommended decision
- Conflicting values
- Source reliability
- Evidence
- AI reasoning
- Suggested master value

### Tier 3 — Low Confidence / Suspicious

```text
confidence < 0.60
```

Potential action:

```text
FLAG FOR REVIEW
OR
KEEP AS DISTINCT ENTITY
```

The system should **not automatically label something as fraud solely because confidence is low**.

---

# 6. Fraud / Risk Detection

Veritas ER should position this as **suspicious identity discrepancy detection**, rather than claiming that the system can definitively prove fraud.

## Example

### Input

```text
FIELD: EMAIL

Source A
rahul@gmail.com
Reliability: 95%

Source B
rahul@gmail.com
Reliability: 85%

Source C
rahul123@gmail.com
Reliability: 60%
```

### System Interpretation

Sources A and B independently agree on the same email while lower-trust Source C introduces a conflicting value.

This creates a:

```text
HIGH-RISK IDENTITY DISCREPANCY
```

Possible explanations include:

- Legitimate email change
- Data-entry error
- Stale source data
- Secondary account
- Identity manipulation
- Potential account takeover attempt

The system therefore **flags the discrepancy rather than declaring fraud as a fact**.

---

## 7. AI Reasoning Output

Example:

```json
{
  "entity_name": "Rahul Sharma",
  "field_analyzed": "email",
  "same_entity_confidence": 0.62,
  "risk_level": "HIGH",
  "risk_type": "POTENTIAL_IDENTITY_MANIPULATION",
  "flagged_source": "Source C",
  "recommended_master_value": "rahul@gmail.com",
  "rejected_value": "rahul123@gmail.com",
  "action": "HUMAN_REVIEW",
  "reasoning": "Two higher-trust sources agree on the existing email while a lower-trust source introduces a conflicting value. Automatic overwrite is therefore unsafe."
}
```

---

# 8. Human-in-the-Loop Review

Human review is essential for ambiguous or high-risk cases.

The Data Steward should see:

```text
┌──────────────────────────────────────────────┐
│ HIGH-RISK IDENTITY DISCREPANCY               │
├──────────────────────────────────────────────┤
│ Entity: Rahul Sharma                         │
│                                              │
│ EMAIL                                        │
│                                              │
│ Source A: rahul@gmail.com     Trust: 95%     │
│ Source B: rahul@gmail.com     Trust: 85%     │
│ Source C: rahul123@gmail.com   Trust: 60% ⚠  │
│                                              │
│ AI REASONING                                 │
│ Two high-trust sources agree on the existing  │
│ email. Source C introduces a conflicting      │
│ value. Automatic overwrite is unsafe.        │
│                                              │
│ [Approve AI Decision] [Override] [Keep Both] │
└──────────────────────────────────────────────┘
```

The user can:

1. Approve the recommendation
2. Override the recommendation
3. Keep conflicting values
4. Mark a source for further investigation
5. Keep records as distinct entities

---

# 9. Master Golden Record

After arbitration and/or human approval, the system creates or updates the Master Golden Record.

Example:

```json
{
  "entity_id": "usr_99a8b12c",
  "name": "Rahul Sharma",
  "email": "rahul@gmail.com",
  "email_source": "SRC_A + SRC_B",
  "status": "VERIFIED",
  "last_updated": "2026-09-07T14:52:00Z"
}
```

The golden record should retain provenance for every important field.

For example:

```text
email
 ├── value: rahul@gmail.com
 ├── selected_from: SRC_A
 ├── corroborated_by: SRC_B
 └── rejected_candidate: rahul123@gmail.com
```

---

# 10. Cryptographic Audit Ledger

Every important decision should be recorded.

The recommended implementation is an append-only hash chain.

Each entry contains:

```text
sequence_id
timestamp
actor
action
entity_id
field_diff
previous_hash
current_hash
```

Example:

```json
{
  "sequence_id": 4092,
  "entity_id": "usr_99a8b12c",
  "action": "GOLDEN_RECORD_UPDATED",
  "actor": "STEWARD_OFFICER",
  "field_diff": {
    "field": "email",
    "old_value": "rahul123@gmail.com",
    "new_value": "rahul@gmail.com"
  },
  "previous_hash": "a8f5f167...",
  "current_hash": "e3b0c442...",
  "timestamp": "2026-09-07T14:52:00Z"
}
```

### Important terminology

SHA-256 does not make a database literally immutable.

The correct claim is:

> **The hash-chained audit ledger is tamper-evident: unauthorized modification can be detected through hash verification.**

---

# 11. Integrity Verification

For each audit entry:

```text
current_hash =
SHA256(
    sequence_id
    + timestamp
    + action
    + entity_id
    + field_diff
    + previous_hash
)
```

Verification checks:

```text
Entry N previous_hash
        ↓
matches
        ↓
Entry N-1 current_hash
```

If a historical entry is modified:

```text
Modified Data
     ↓
Hash changes
     ↓
Next entry's previous_hash no longer matches
     ↓
INTEGRITY FAILURE
```

---

# 12. Time-Travel / Historical Reconstruction

The audit ledger allows the system to reconstruct how the Golden Record changed over time.

Example:

```text
10:00
email = rahul@gmail.com

12:30
Source C submits rahul123@gmail.com

12:31
Conflict detected

12:35
Human reviewer rejects conflicting update

12:36
Golden record remains rahul@gmail.com
```

This provides an explainable history of data changes.

---

# 13. Anti-Hallucination Guardrails

The LLM should operate under strict constraints.

### Rule 1 — Evidence Only

The model can reason only over supplied source records and system metadata.

### Rule 2 — Structured Output

Use a predefined JSON schema.

### Rule 3 — No Unsupported Facts

The model must not invent:

- Addresses
- Emails
- Identity information
- Source reliability
- Historical events

### Rule 4 — Human Review for High-Risk Actions

The LLM should recommend rather than independently execute sensitive decisions.

### Rule 5 — Deterministic Validation

Backend rules validate the LLM output before database changes.

Example:

```text
LLM Recommendation
       ↓
Schema Validation
       ↓
Business Rule Validation
       ↓
Confidence/Risk Policy
       ↓
Human Approval OR Safe Automation
```

---

# 14. Proposed Backend Architecture

```text
                    FRONTEND
                       │
                       ▼
                 API / BACKEND
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   INGESTION       ENTITY MATCHING   REVIEW API
        │              │              │
        ▼              ▼              ▼
 NORMALIZATION     CANDIDATE          HUMAN
                   BLOCKING           REVIEW
                       │
                       ▼
                LLM ARBITRATOR
                       │
                       ▼
                DECISION ENGINE
                       │
             ┌─────────┴─────────┐
             ▼                   ▼
       GOLDEN RECORD        AUDIT LEDGER
             │                   │
             └─────────┬─────────┘
                       ▼
                  PostgreSQL
```

---

# 15. Active Technology Stack

## Frontend

- React (Vite)
- Tailwind CSS
- TanStack Query / Axios client (`frontend/src/services/api.js`)

## Backend

- **Node.js (v18+) & Express.js**: ESM modular routes, controllers, services.
- **Security & Validation**: Helmet, Zod validation schemas (`uploadSchema`, `reviewSchema`), IP Rate Limiter (100 req/min), Request-ID tracing (`X-Request-ID`).
- **File Processing**: Multer memory storage & PapaParse CSV/JSON parsing engine.
- **Caching**: Redis (`ioredis`) with automatic in-memory Map fallback.

## Database

- **Supabase (PostgreSQL)**
- `pg_trgm` extension for trigram text similarity
- `uuid-ossp` extension for primary key UUIDs
- JSONB columns for multi-source raw payloads

## AI & ML

- Supervised Pairwise Matcher ($C_{match} \in [0.0, 1.0]$)
- Candidate Blocking Engine (`blockingService.js`)
- Custom LLM Arbitrator Integration Slot (`/api/v1/arbitrate`)

## Security & Cryptographic Audit

- SHA-256 Hash-Chained Audit Ledger (`student_audit_ledger`)
- SHA-256 Chain Verification API (`GET /api/entities/verify-ledger`)
- Role-based Access Control (RBAC)

---

# 16. End-to-End Example

```text
1. User uploads three customer datasets
              ↓
2. System validates schemas
              ↓
3. Records are normalized
              ↓
4. Candidate blocking finds potentially matching entities
              ↓
5. Matching evidence is assembled
              ↓
6. LLM arbitrator evaluates conflicts
              ↓
7. Confidence/risk score is calculated
              ↓
8. Decision enters confidence triage
              ↓
     ┌────────┼─────────┐
     ▼        ▼         ▼
   Auto     Human     Flag /
   Merge    Review    Distinct
     │        │         │
     └────────┼─────────┘
              ▼
9. Golden Record is created/updated
              ↓
10. Decision + provenance are recorded
              ↓
11. SHA-256 hash chain is updated
              ↓
12. Integrity can be verified later
```

---

# 17. Key Design Principle

Veritas ER should **not** position itself as:

> "An LLM that decides which record is correct."

Instead:

> **"An evidence-driven entity resolution and data governance platform where AI assists with complex conflict arbitration, while deterministic rules, source provenance, confidence thresholds, and human oversight control final decisions."**

This distinction makes the architecture more credible, safer, and easier to defend during a technical evaluation.

---

# 18. Hackathon Pitch — One-Line Architecture

> **Ingest → Normalize → Block → Reason → Triage → Review → Golden Record → Cryptographically Auditable History**

