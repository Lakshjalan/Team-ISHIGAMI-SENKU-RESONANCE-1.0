# Stitch Prompt 04: Golden Master Directory Page

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build a searchable database directory displaying single-source-of-truth Golden Master Student Profiles.

### Header & Actions
- Title: **"Golden Master Directory"** (Serif 32px, white).
- Subtitle: "Unified, single-source-of-truth master profiles resolved across all enterprise input sources."
- Action Bar:
  - Search Input: Capsule format `[ 🔍 Search by Golden Name, Email, or Reg No... ]` (`rounded-full`, bg `#1c1b1b`).
  - Branch Filter Capsule: `[ All Branches ▾ ]`.
  - Export Button: `[ 📥 Export Master Catalog (CSV / JSON) ]` (white pill button).

### Master Profiles Data Table Container (`bg #201f1f`, `rounded-3xl`, p-6)
- Table Headers: `Golden ID` | `Student Name` | `Registration No` | `Primary Email` | `Phone` | `Linked Sources` | `Confidence Score` | `Actions`.
- Table Rows (High Contrast Dark Rows, hover bg `#2a2a2a`):
  1. `MST-1004` | **Rahul Sharma** | `2021BTCS042` | `rahul.sharma@alumni.org` | `+91 98765 43210` | Chips: `ERP` `Campus` `Alumni` | `98%` (Green Pill) | `[ View Audit → ]`.
  2. `MST-1005` | **Priya Singh** | `2021BCE0192` | `priya.singh@campus.edu` | `+91 98111 22334` | Chips: `ERP` `Campus` | `94%` (Green Pill) | `[ View Audit → ]`.
  3. `MST-1006` | **Amit Kumar** | `2021MECH081` | `amit.k@gmail.com` | `+91 97112 33445` | Chips: `ERP` `Alumni` | `88%` (Amber Pill) | `[ View Audit → ]`.

### Slide-Over Profile Provenance Drawer (On Row Click)
- Slide-over panel (`bg #1c1b1b`, backdrop blur `backdrop-blur-md`):
  - Header: **Rahul Sharma** (`MST-1004`).
  - Provenance Breakdown: Shows 3 underlying raw records from Banking, Hostel, and Alumni DB that were merged into this single identity.
  - Action: `[ Open Cryptographic Audit History → ]`.
