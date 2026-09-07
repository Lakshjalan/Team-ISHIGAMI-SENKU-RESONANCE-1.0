# RECONCILE.AI — Intelligent Reconciliation of Conflicting Digital Records
## Product Requirements Document (PRD)
**Hackathon Round 1 • PPT & Development Reference**

> **Tagline:** *From conflicting records to one trusted source of truth.*

---

## 1. Executive Summary
**RECONCILE.AI** is an evidence-driven entity resolution and data reconciliation platform. It identifies records that represent the same real-world entity across multiple data sources, detects field-level conflicts, recommends trustworthy values using confidence and source reliability, routes uncertain cases to human review, and preserves the evidence and audit history behind every decision.

**Core promise:** We do not simply merge data. We explain *why* the data was merged and preserve the original source history.

---

## 2. Problem Statement
Organizations maintain the same entities across independent systems such as ERP, CRM, HR, billing, placement, alumni, hospital, laboratory, or other databases. These systems frequently contain inconsistent, duplicated, incomplete, or outdated records.

### Example Scenario:
| Source | Name | Email | Phone | Department |
| :--- | :--- | :--- | :--- | :--- |
| **ERP** | Rahul Sharma | `rahul@gmail.com` | 9876543210 | CSE |
| **Placement** | Rahul S. | `rahul@gmail.com` | 9876543210 | Computer Science |
| **Alumni** | Rahul Sharma | `rahul.sharma@gmail.com` | 9876543210 | CSE |

The system must answer two questions:
1. **Identity:** Are these records referring to the same entity?
2. **Truth:** If they are, which values should the unified record contain?

A complete solution must also preserve the source records and the evidence behind every reconciliation decision.

---

## 3. Objectives
- **Detect duplicate or potentially duplicate entities** across data sources.
- **Normalize inconsistent representations** such as names, phone numbers, emails, and dates.
- **Detect field-level conflicts** after matching records.
- **Generate confidence scores** using multiple matching signals.
- **Use source reliability, agreement, recency, and field-specific rules** to recommend resolutions.
- **Automatically resolve high-confidence cases** and route uncertain cases to human review.
- **Create a trusted master record** without deleting original source data.
- **Maintain an auditable history** of source values, decisions, reasons, timestamps, and confidence.

---

## 4. Proposed Solution
The platform follows an end-to-end reconciliation pipeline:

```
Multiple Data Sources
        │
        ▼
  Data Ingestion
        │
        ▼
  Normalization
        │
        ▼
Entity / Duplicate Detection
        │
        ▼
 Conflict Detection
        │
        ▼
Confidence Scoring
        │
        ▼
Intelligent Resolution
        │
        ▼
Human Approval (when required)
        │
        ▼
Trusted Master Record
        │
        ▼
Evidence + Audit History
```

**Core Design Principle:** Non-destructive reconciliation — original records remain fully intact and available even after a master record is created.

---

## 5. Detailed Functional Flow

### 5.1 Data Ingestion
- **MVP Input:** Multiple CSV files representing different data sources.
- Each source is registered with a source name and a reliability score.
- Each uploaded record retains its source identity and original/raw representation.
- *Future extensions:* Excel, JSON, APIs, and live database connectors.

### 5.2 Data Normalization
Normalization converts syntactic variations into standard comparable values while preserving the raw input.
- **Names:** `"RAHUL SHARMA"` / `"Rahul Sharma "` / `"Rahul Sharma"` → `"rahul sharma"`
- **Phones:** `"+91 98765 43210"` / `"9876543210"` / `"91-9876543210"` → `"9876543210"`

### 5.3 Entity Resolution / Duplicate Detection
Candidate records are compared using multiple weighted attributes rather than relying on a single field.

| Signal | Example | Weight |
| :--- | :--- | :--- |
| **Phone match** | Exact / normalized match | 30% |
| **Email match** | Exact / normalized match | 30% |
| **Name similarity** | Fuzzy algorithm (e.g. Jaro-Winkler, Levenshtein) | 25% |
| **Department / Related Attribute** | Exact / domain match | 10% |
| **Other attributes** | Additional fields | 5% |

#### Illustrative Confidence Thresholds:
- **90–100%:** High confidence → Eligible for automatic reconciliation.
- **75–89%:** Medium confidence → Routed to human review.
- **Below 75%:** Low confidence → Kept unresolved / separate entities.

*Note: Thresholds and weights are configurable and will be tuned during implementation and testing.*

---

## 6. Conflict Detection
Once records are identified as belonging to the same entity, the system compares each field to identify disagreements.

### Email Conflict Example:
- **Source A:** `rahul@gmail.com` ✓
- **Source B:** `rahul@gmail.com` ✓
- **Source C:** `rahul.sharma@gmail.com` ⚠
- **Result:** Conflict detected for `email`.

A conflict is not automatically treated as an error; it becomes an evidence-evaluation problem.

---

## 7. Intelligent Reconciliation
For each conflicting field, the system evaluates several factors:

| Factor | Purpose |
| :--- | :--- |
| **Source Reliability** | Higher-trust systems receive greater weight. |
| **Cross-Source Agreement** | Independent agreement across multiple sources strengthens evidence. |
| **Recency** | Recent verified values may be preferred. |
| **Field-Specific Rules** | Phone, email, name, and address require specialized matching logic. |
| **Match Confidence** | Overall entity confidence score informs the decision. |

### Reconciliation Example:
| Source | Department Value | Source Reliability |
| :--- | :--- | :--- |
| **ERP** | CSE | 95% |
| **Placement** | Computer Science | 85% |
| **Alumni** | CSE | 75% |

- **Recommendation:** `CSE`
- **Reasoning:** Two sources agree, including the highest-reliability ERP source.
- **Store:** System stores the decision reason and confidence score without overwriting original source values.

---

## 8. Human-in-the-Loop
Automation is confidence-driven, not blind.

- **High Confidence:** Auto-resolve
- **Medium Confidence:** Human review required
- **Low Confidence:** Keep unresolved

### Reviewer Actions:
- **Accept** the AI/engine recommendation.
- **Reject** the recommendation.
- **Manually choose or edit** the final value.

---

## 9. Master Record
After reconciliation, the system creates a unified representation of the entity.

```
┌──────────────────────────────────────────────┐
│                MASTER RECORD                 │
├──────────────┬───────────────────────────────┤
│ Name         │ Rahul Sharma                  │
│ Email        │ rahul@gmail.com               │
│ Phone        │ 9876543210                    │
│ Department   │ CSE                           │
│ Confidence   │ 94%                           │
└──────────────┴───────────────────────────────┘
```

The original source records are not deleted. The master record is a derived, trusted view supported by source evidence.

---

## 10. Evidence & Audit Trail
For every reconciled field, the platform retains complete decision metadata:
- Original value
- Source
- Timestamp
- Confidence
- Selected value
- Decision status
- Reason / evidence

### Audit Trail Example for `email`:
- **Source A:** `rahul@gmail.com`
- **Source B:** `rahul@gmail.com`
- **Source C:** `rahul.sharma@gmail.com`
- **Selected:** `rahul@gmail.com`
- **Reason:** 2 sources agree + higher source reliability
- **Confidence:** 91%

This allows administrators to answer immediately: *"Why does the master record contain this value?"*

---

## 11. User Experience / Core Screens

| Screen | Purpose |
| :--- | :--- |
| **Dashboard** | High-level metrics: total records, duplicates found, active conflicts, resolution statistics. |
| **Data Upload** | Ingest and register multiple source datasets with reliability configurations. |
| **Analysis / Match Groups** | View clusters of records identified as representing the same entity. |
| **Conflict Review** | Compare conflicting field values, view evidence, and make manual decisions. |
| **Master Record** | View the unified, reconciled entity and overall confidence score. |
| **Audit History** | Inspect the complete, immutable decision trail and source provenance. |

---

## 12. System Architecture

```
┌─────────────────────────────────────────┐
│               React Client              │
│ ┌───────────────┬─────────────────────┐ │
│ │ Dashboard     │ Data Upload         │ │
│ │ Conflicts     │ Master Records      │ │
│ │ Audit History │                     │ │
│ └───────────────┴─────────────────────┘ │
└────────────────────┬────────────────────┘
                     │ REST API
                     ▼
┌─────────────────────────────────────────┐
│            Express.js Backend           │
├─────────────────────────────────────────┤
│ Auth / APIs                             │
│ File Ingestion & Processing             │
│ Business Logic & Orchestration          │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┼────────────┐
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌─────────────┐
│  PostgreSQL  │ │ Matching │ │  AI Layer   │
│              │ │  Engine  │ │             │
│ Records      │ │Similarity│ │ Explain-    │
│ Conflicts    │ │ Scoring  │ │  ability    │
│ Audit Trail  │ │  Rules   │ │             │
└──────────────┘ └──────────┘ └─────────────┘
```

---

## 13. Proposed Technology Stack

| Layer | Technology / Approach |
| :--- | :--- |
| **Frontend** | React, HTML/CSS, JavaScript / Tailwind |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL + JSONB (for flexible raw source records) |
| **Matching Engine** | Exact matching + Fuzzy similarity algorithms + Weighted scoring |
| **AI Layer** | LLM-assisted explanation & recommendation engine |
| **Version Control** | Git + GitHub PR workflow |

---

## 14. Data Model

### `SOURCE`
- `id` (PK)
- `name` (VARCHAR)
- `reliability_score` (FLOAT)
- `created_at` (TIMESTAMP)

### `RECORD`
- `id` (PK)
- `source_id` (FK -> SOURCE.id)
- `external_id` (VARCHAR)
- `raw_data` (JSONB)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### `MATCH`
- `id` (PK)
- `record_a_id` (FK -> RECORD.id)
- `record_b_id` (FK -> RECORD.id)
- `match_score` (FLOAT)
- `status` (ENUM: pending, resolved, rejected)

### `CONFLICT`
- `id` (PK)
- `match_id` (FK -> MATCH.id)
- `field_name` (VARCHAR)
- `value_a` (TEXT)
- `value_b` (TEXT)
- `resolution` (TEXT)
- `confidence` (FLOAT)
- `status` (ENUM: auto_resolved, human_review, unresolved)

### `AUDIT_HISTORY`
- `id` (PK)
- `master_record_id` (VARCHAR / FK)
- `field_name` (VARCHAR)
- `old_value` (TEXT)
- `new_value` (TEXT)
- `reason` (TEXT)
- `source_id` (FK -> SOURCE.id)
- `created_at` (TIMESTAMP)

---

## 15. Hackathon MVP Scope

**Goal:** Build a complete, demonstrable reconciliation loop rather than an overly complex enterprise platform.

| Feature Area | MVP Deliverable |
| :--- | :--- |
| **Input** | 3 structured CSV datasets |
| **Normalization** | Names, phones, emails, dates, basic formatting |
| **Entity Resolution** | Exact + fuzzy comparison with weighted scoring |
| **Conflict Detection** | Field-level conflicts detection |
| **Resolution Engine** | Source reliability + cross-source agreement + recency + rules |
| **Human Review** | Interface to accept, reject, or manually resolve conflicts |
| **Output** | Master record + confidence score |
| **Evidence** | Source-level evidence display for all decisions |
| **History** | Auditable reconciliation log |
| **AI Layer** | Explanation generation after core engine execution |

---

## 16. Differentiation Strategy

The entity resolution space contains established enterprise platforms (IBM MDM, Informatica, Reltio, Ataccama, AWS Entity Resolution). RECONCILE.AI focuses on a distinct, defensible approach:

- **Evidence-First Reconciliation:** Every decision is backed by transparent, visible source evidence.
- **Human-in-the-Loop:** Uncertain decisions are intelligently escalated rather than blindly automated.
- **Field-Level Reasoning:** Each conflicting field is evaluated and resolved independently.
- **Confidence-Driven Automation:** Automation level adapts dynamically based on confidence thresholds.
- **Accessible Workflow:** Simple ingestion and review experience for organizations needing rapid reconciliation without heavyweight MDM friction.

---

## 17. Use Cases

- **Education:** Reconciling student data across ERP, placement, examinations, alumni network, and library databases.
- **Enterprise / HR:** Unified employee records across HR, payroll, attendance, recruitment, and CRM platforms.
- **Healthcare:** Merging patient records across hospital management systems, laboratories, insurance providers, and clinical records.
- **E-commerce:** Customer 360 view combining orders, loyalty programs, inventory interactions, and CRM profiles.
- **Government:** Cross-departmental citizen record reconciliation.

---

## 18. Expected Impact

```
WITHOUT RECONCILIATION:
Multiple Sources ──► Duplicate / Conflicting Data ──► High Risk & Manual Verification

WITH RECONCILE.AI:
Multiple Sources ──► Normalize ──► Match ──► Detect Conflicts ──► Resolve ──► Master Record ──► Evidence & Audit Trail
```

- Dramatically reduces manual data verification efforts.
- Eliminates duplicate entities across siloed databases.
- Prevents untraceable, silent data overwrites.

---

## 19. Future Scope
- Excel, JSON, XML, REST API, and direct SQL database connectors.
- Real-time event-driven reconciliation.
- ML-based entity resolution models trained on historical human approvals.
- Advanced semantic matching for complex addresses and free-text attributes.
- Role-based access control (RBAC) and enterprise data governance.
- Automated data-quality monitoring, drift detection, and proactive alerts.

---

## 20. Recommended Demo Scenario

Use a deliberately messy three-source dataset:

- **Source A (ERP):** `1024 | Rahul Sharma | rahul@gmail.com | 9876543210 | CSE`
- **Source B (Placement):** `ST-881 | RAHUL S. | rahul@gmail.com | +91 9876543210 | Computer Science`
- **Source C (Alumni):** `P-442 | Rahul Sharma | rahul.sharma@gmail.com | 9876543210 | CSE`

### Demo Execution Sequence:
1. **Upload** all three CSV datasets.
2. **Show Normalization** of raw names and phone numbers.
3. **Show Duplicate Match** with 90%+ match confidence.
4. **Inspect Email Conflict** (`rahul@gmail.com` vs `rahul.sharma@gmail.com`).
5. **Display Evidence & Reliability** ratings.
6. **Show AI Recommendation** and explanation.
7. **Approve Resolution**.
8. **View Master Record** output.
9. **Open Audit History** and prove original source records remain preserved.

---

## 21. Development Plan After Round 1

```
PRD / Pitch
     │
     ▼
Choose Demonstration Domain
     │
     ▼
Create Sample Datasets
     │
     ▼
Design PostgreSQL Schema
     │
     ▼
Set Up Git & Folder Structure
     │
     ▼
Build Express APIs
     │
     ▼
Build Reconciliation Engine
     │
     ▼
Connect PostgreSQL
     │
     ▼
Build React UI
     │
     ▼
Integrate End-to-End
     │
     ▼
Add AI Explanation Layer
     │
     ▼
Testing with Demo Dataset
     │
     ▼
Final Pitch & Live Demo
```

---

## 22. Team Division

| Role | Primary Responsibility |
| :--- | :--- |
| **Frontend** | React dashboard, upload UI, conflict review interface, master record view, audit history. |
| **Backend** | Express REST APIs, file ingestion & parsing, database integration. |
| **Reconciliation Engine** | Normalization pipeline, similarity algorithms, match scoring, conflict detection, resolution logic. |
| **Database / AI / Integration** | PostgreSQL schema design, JSONB models, audit trail logging, AI explanation integration, system wiring. |

---

## 23. Git Workflow

```
main
 ├── feature/frontend-dashboard
 ├── feature/backend-api
 ├── feature/reconciliation-engine
 └── feature/database
```

- Developer creates feature branch.
- Commits and pushes to GitHub.
- Opens Pull Request (PR).
- Peer code review.
- Merges into `main`.

---

## 24. Final Product Statement

> **RECONCILE.AI** is an evidence-driven entity resolution platform that identifies records representing the same entity across multiple data sources, detects field-level conflicts, recommends trustworthy values using confidence and source reliability, involves a human when confidence is low, and preserves the complete audit trail behind every reconciliation.

**Final message for judges:**  
*One entity. Multiple sources. One trusted view — with the evidence to prove it.*
