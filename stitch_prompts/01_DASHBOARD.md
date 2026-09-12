# Stitch Prompt 01: Dashboard / Command Center

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build a high-contrast dark enterprise AI Command Center dashboard for SYNTRA identity deduplication platform.

### Header & Top Navigation
- Left: SYNTRA logo in crisp white serif with a glowing green live badge (`• OPERATIONAL`).
- Navigation Capsule Bar (`rounded-full`, bg `#1c1b1b`, border 1px `#444748`): `COMMAND CENTER` (active pill), `INGEST & DATASETS`, `CONFLICT TRIAGE`, `GOLDEN MASTER DIRECTORY`, `AUDIT LOG`, `ADMIN`.
- Right: User Profile Avatar pill `[ 👤 ADMIN ]`.

### Hero Section
- Sub-badge: `• OPERATIONAL · RUN #1048 · SYNCED JUST NOW`
- Heading: **"Good morning, Admin"** (Large serif `Libre Caslon Text`, 40px white).
- Subtitle: "Automated multi-source identity deduplication & entity resolution runtime."
- Action Triggers: `[ COMMAND CENTER ]` (active white pill), `[ AUDIT & TELEMETRY ]`, `[ ▷ + NEW RUN ]` (white filled pill button).

### Bento Grid Metric Cards (3 Cards)
1. **System Health Pod** (`bg #201f1f`, `rounded-3xl`):
   - Label: `SYSTEM HEALTH` (label-md, `#c4c7c8`).
   - Hero Number: `98.4%` (`+0.4%` green chip).
   - Footer: `Confidence Threshold: 85%` | `High Reliability`.
2. **Ingested Records Pod** (`bg #201f1f`, `rounded-3xl`):
   - Label: `INGESTED RECORDS`.
   - Hero Number: `142,890`.
   - Footer: `ACROSS 3 ENTERPRISE SOURCES` | `ERP · Campus · Alumni`.
3. **Master Identities Pod** (`bg #201f1f`, `rounded-3xl`):
   - Label: `MASTER IDENTITIES`.
   - Hero Number: `118,420` (`CONSENSUS`).
   - Footer: `SINGLE ID CONSENSUS` | `92.8% Resolution`.

### Resolution Pipeline Stepper Bar
- Horizontal capsule container (`bg #1c1b1b`, `rounded-3xl`, p-4):
  `01 INGEST 142,890 (DONE) → 02 MATCH 139,120 (DONE) → 03 CONFLICT 3,770 (REVIEW) → 04 RESOLVE 102,880 (ACTIVE)`

### "Needs Your Attention" Conflict Widget
- Card Header: **"Needs Your Attention"** `3 PENDING` (amber pill).
- Description: "High-entropy candidate matches below confidence thresholds requiring manual operator review."
- List of 3 Conflict Pods (`bg #1c1b1b`, `rounded-2xl`):
  1. `RS` Avatar | **Rahul Sharma** | `EMAIL` `89% MATCH` | `rahul.sharma@alumni.org (Alumni 75%)` vs `r.sharma@techcorp.io (Campus 88%)` | `[ REVIEW → ]` (white pill button).
  2. `PS` Avatar | **Priya Singh** | `PHONE` `94% MATCH` | `+91 98765 43210 (ERP 95%)` vs `+91 98111 22334 (Campus 88%)` | `[ REVIEW → ]`.
  3. `AK` Avatar | **Amit Kumar** | `ADDRESS` `81% MATCH` | `Sector 62, Noida (ERP 95%)` vs `Indirapuram, GZB (Alumni 75%)` | `[ REVIEW → ]`.

### Footer Status Bar
- `• NODE MESH: EU-CENTRAL-1 (99.998%)` · `KERNEL BUILD: V4.18.2-PROD-ENC` · `COMPLIANCE ARCHITECTURE` · `DATA GOVERNANCE & PII` · `© 2025 SYNTRA INC.`
