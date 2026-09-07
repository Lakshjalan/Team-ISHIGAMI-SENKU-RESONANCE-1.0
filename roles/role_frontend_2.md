# Role Specification: Frontend Engineer 2
## Conflict Review Queue, Master Records, Audit Ledger & Analytics UI

**Owner**: Frontend Engineer 2  
**Domain**: Human-in-the-Loop Conflict Resolution, Golden Master Record View, Cryptographic Audit Ledger, Analytics Dashboard  
**Architecture Reference**: [TRD.md](file:///c:/Users/laksh/Desktop/Resonance/TRD.md) | [architecture.md](file:///c:/Users/laksh/Desktop/Resonance/architecture.md)

---

## 1. Overview & Core Mission
Frontend Engineer 2 is responsible for the core analytical and decision-making views of **Veritas ER / RECONCILE.AI**. This includes the Human-in-the-Loop Review Queue for ambiguous entity matches ($0.60 \le C_{match} < 0.90$), side-by-side field comparison cards with LLM explanations, confidence score indicators, the immutable cryptographic audit ledger timeline, and the executive analytics dashboard.

---

## 2. Direct Folder & File Ownership

### 📁 Owned Files & Components
```text
frontend/
├── src/
│   ├── pages/
│   │   ├── Dashboard.jsx          # Analytics & system metrics dashboard
│   │   ├── ReviewQueue.jsx        # Conflict triage interface for ambiguous record pairs
│   │   └── AuditHistory.jsx       # Audit ledger & time-travel record history view
│   ├── components/
│   │   ├── ReviewCard.jsx         # Side-by-side field comparison & LLM recommendation card
│   │   ├── ConfidenceBadge.jsx    # Match confidence triage badge (High, Ambiguous, Low)
│   │   └── AuditTimeline.jsx      # Visual audit trail timeline with SHA-256 hashes
│   ├── services/
│   │   └── api.js                 # Review Queue, Audit, & Golden Record API client methods (shared with FE1)
│   └── App.jsx                    # Routing configuration (Dashboard, Review, Audit routes)
```

---

## 3. Key Responsibilities & Features

1. **Human-in-the-Loop Review Queue (`ReviewQueue.jsx`, `ReviewCard.jsx`)**
   - Display pending record conflict pairs that fall into the ambiguous triage band ($0.60–0.89$).
   - Build side-by-side comparison tables highlighting conflicting field values (e.g., mismatched name spellings or phone numbers).
   - Render the Custom LLM reasoning card explaining *why* fields conflict and recommending the optimal merged value.
   - Provide interactive **Approve Merge**, **Reject / Keep Distinct**, and **Manual Override** action buttons.

2. **Confidence Triage Visuals (`ConfidenceBadge.jsx`)**
   - Render dynamic confidence score badges:
     - **Green (`>= 0.90`)**: High Confidence / Auto-Merged.
     - **Amber (`0.60 - 0.89`)**: Ambiguous / Requires Human Review.
     - **Red (`< 0.60`)**: Low Confidence / Flagged / Distinct.

3. **Cryptographic Audit Ledger & Time Travel (`AuditHistory.jsx`, `AuditTimeline.jsx`)**
   - Render a vertical timeline of record changes, resolutions, and manual overrides.
   - Display SHA-256 tamper-evident hash links for every committed change.
   - Provide a "Time-Travel" toggle allowing users to view historic states of a Golden Master Record before specific merges occurred.

4. **Analytics & Performance Dashboard (`Dashboard.jsx`)**
   - Render KPI metrics cards: Total Records Ingested, Auto-Merge Count, Active Conflict Queue Size, Resolution Throughput, and Source Trust Rankings.
   - Show chart visualisations of match confidence distribution.

---

## 4. API & Integration Handoff Points

- **Consumes Backend APIs** (Built by Backend Engineer):
  - `GET /api/review/queue`: Retrieve pending ambiguous conflict pairs.
  - `POST /api/review/resolve`: Submit human decision (approve, reject, or manual edit).
  - `GET /api/entities/master`: Fetch Golden Master Records list and search.
  - `GET /api/entities/:id/audit`: Retrieve cryptographic audit trail and time-travel history.
  - `GET /api/dashboard/stats`: Fetch system analytics and throughput data.
- **Supabase Realtime Subscription**:
  - Subscribe to real-time changes on the `conflict_queue` table to dynamically update the review queue counter.

---

## 5. Definition of Done (DoD)
- [ ] Review Queue displays record pairs side-by-side with visual field diffs.
- [ ] LLM explanation card renders reasoning text clearly next to candidate pairs.
- [ ] Human resolution actions (Approve / Reject / Edit) send updates to backend and remove resolved pairs from queue.
- [ ] Audit Timeline correctly displays SHA-256 hashes and historic state snapshots.
- [ ] Dashboard KPI cards accurately reflect real-time system counts.
