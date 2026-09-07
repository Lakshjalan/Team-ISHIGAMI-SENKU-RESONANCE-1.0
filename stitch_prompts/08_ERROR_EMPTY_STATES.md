# Stitch Prompt 08: Error Pages, Empty States & Skeleton Loaders

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

---

## Screen Description 01: 404 Not Found Screen (`/404`)
Build a tactical dark 404 error page.

### 404 Bento Card (`bg #201f1f`, `rounded-3xl`, max-w 500px, p-8, text-center)
- Icon: Disconnected Hash Node Vector in circular badge (`bg #2a2a2a`).
- Error Number: **404** (Serif 64px `Libre Caslon Text`, white).
- Title: **"Entity Record or Route Not Found in Mesh"** (Serif 24px).
- Description: "The requested record ID or application route does not exist or has been archived."
- Capsule Search Bar: `[ 🔍 Search Record ID... ]`.
- Action Button: `[ ← Return to Command Center ]` (white filled pill button).

---

## Screen Description 02: 500 System Error / Disconnect Screen (`/500`)
Build a database outage alert page.

### 500 Bento Card (`bg #201f1f`, `rounded-3xl`, border 1px `#93000a`, max-w 500px, p-8, text-center)
- Icon: Alert Shield Vector in dark red badge (`bg #93000a/40`).
- Error Code: **500 - DATABASE DISCONNECTED**.
- Message: "The backend Express or Supabase PostgreSQL database connection timed out. Engine is attempting auto-reconnect."
- Automated Retry Bar: `Retrying in 5 seconds...` (Pulsing progress bar).
- Manual Action: `[ ⚡ Force Reconnect Now ]` (white pill button).

---

## Screen Description 03: Empty States Component (`<EmptyState />`)
Build two clean empty state components for table placeholders.

1. **Zero Conflicts Pending**:
   - Card (`bg #201f1f`, `rounded-3xl`, p-8, text-center).
   - Checkmark Shield Icon + **"All Conflicts Resolved!"**.
   - Subtitle: "There are currently 0 ambiguous record pairs in the review queue. Master Golden Records are fully reconciled."
2. **Zero Uploaded Sources**:
   - Card (`bg #201f1f`, `rounded-3xl`, p-8, text-center).
   - Upload Icon + **"No Data Sources Registered Yet"**.
   - Subtitle: "Upload a CSV or JSON dataset to populate the entity matching mesh."
   - Action: `[ Ingest First Dataset → ]` (white pill button).

---

## Screen Description 04: Bento Shimmer Skeleton Loader (`<SkeletonLoader />`)
Build a dark shimmer loading state matching your Bento Grid layout.

- Container: `bg #201f1f`, `rounded-3xl`, `animate-pulse`.
- Shimmer Text Lines: `bg #2a2a2a`, `rounded-full` height bars.
- Table Row Shimmer: 4 horizontal skeleton rows with circular avatar shimmers and pill button shimmers.
