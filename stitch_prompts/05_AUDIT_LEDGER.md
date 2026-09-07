# Stitch Prompt 05: Cryptographic Audit Ledger & Time Travel Page

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build an immutable, cryptographic SHA-256 audit ledger timeline screen for RECONCILE.AI data governance.

### Header & Chain Status Banner
- Title: **"Cryptographic Audit Ledger & Integrity Timeline"** (Serif 32px, white).
- Subtitle: "Tamper-evident, hash-chained audit ledger logging all identity merges, manual overrides, and state changes."
- Ledger Status Banner (`bg #201f1f`, `rounded-3xl`, p-5, border 1px green `#00c853/30`):
  - Left: Shield Check Icon + **"Ledger Chain Status: TAMPER-FREE (100% Valid SHA-256 Chain)"**.
  - Right: Action Button `[ ⚡ Re-Verify Hash Chain Integrity ]` (white pill button).

### Interactive Hash Chain Timeline Tree (`bg #201f1f`, `rounded-3xl`, p-6)
- Timeline Nodes connected by vertical glowing line:
  1. **Node 3 (Latest)** — `MERGE_APPROVED`
     - Timestamp: `Sep 07, 2026 · 21:55:42 UTC` | Operator: `admin@reconcile.ai`.
     - Master Profile: `Rahul Sharma (MST-1004)`.
     - Previous Hash Chip: `0000...0000` (`#1c1b1b` pill).
     - Current SHA-256 Hash Chip: `8a7f92bc...e19d` (click to copy full 64-char hash).
     - Summary Badge: `Approve merge between Banking System (SRC_A) & Hostel ERP (SRC_B)`.
  2. **Node 2** — `MANUAL_OVERRIDE`
     - Timestamp: `Sep 07, 2026 · 21:20:10 UTC` | Operator: `operator_2`.
     - Change: `Updated golden_phone_number to +91 98765 43210`.
     - Current SHA-256 Hash Chip: `4b1c88d2...a90f`.
  3. **Node 1 (Genesis)** — `INITIAL_INGESTION`
     - Timestamp: `Sep 07, 2026 · 21:00:00 UTC` | System Genesis.
     - Previous Hash: `0000000000000000000000000000000000000000000000000000000000000000`.

### Time-Travel Historical Snapshot Viewer
- Slider Control: `[ Historical Snapshot Time Slider: 100% Current ]`.
- Allows operators to view how a Golden Profile looked at any historical timestamp.
