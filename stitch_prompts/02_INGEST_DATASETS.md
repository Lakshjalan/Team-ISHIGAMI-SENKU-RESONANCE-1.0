# Stitch Prompt 02: Ingest & Datasets Page

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build a data ingestion and drag-and-drop file import screen for RECONCILE.AI.

### Header
- Title: **"Data Ingestion & Source Registries"** (Serif 32px, white).
- Subtitle: "Upload CSV or JSON files to register raw student/customer identities into candidate matching pool."

### Main Layout (2 Columns)

#### Column 1: Drag-and-Drop Ingestion Zone
- Large Bento Dropzone Card (`bg #201f1f`, `rounded-3xl`, border 2px dashed `#444748`):
  - Upload Icon in circular frosted badge (`bg #2a2a2a`, `rounded-full`).
  - Text: **"Drag & drop dataset files here"** or `[ Browse Local Disk ]` (white pill button).
  - Supported formats pill tag: `CSV` · `JSON` · `MAX 500 MB`.
  - Source Metadata Fields:
    - Source Name Capsule Input: `[ e.g., Core Banking ERP ]` (`rounded-full`, bg `#1c1b1b`).
    - Reliability Score Slider: `0.95` (`95% Trust Level`).
  - Action Button: `[ ⚡ Start Data Ingestion & Normalization Pipeline ]` (white filled pill button).

#### Column 2: Active Source Registries Grid
- 3 Active Data Origin Pods (`bg #201f1f`, `rounded-3xl`):
  1. **Core Banking System (ERP)**: `54,290 Records` | Reliability: `95%` | Status: `ACTIVE` (green badge).
  2. **Campus Management System**: `62,100 Records` | Reliability: `88%` | Status: `ACTIVE`.
  3. **Alumni Network Portal**: `26,500 Records` | Reliability: `75%` | Status: `ACTIVE`.
- Each card features:
  - Trust score circular arc progress.
  - Ingestion timestamp: `Last updated 4 mins ago`.
  - Action: `[ View Raw Records → ]`.

### Progress & Schema Preview Bar
- Ingestion Progress Card: Interactive progress bar showing `Ingesting 12,000 / 12,000 records (100% Complete)`.
- Normalization Status: `✔ Names standardized` · `✔ Phone numbers cleaned` · `✔ Redis cache warmed`.
