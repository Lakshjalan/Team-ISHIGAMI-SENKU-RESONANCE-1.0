# Role Specification: Frontend Engineer 1
## Ingestion, Authentication & Data Preparation UI

**Owner**: Frontend Engineer 1  
**Domain**: User Authentication, Data Ingestion, Source Management, Layout & Navigation, Ingestion API Integration  
**Architecture Reference**: [TRD.md](file:///c:/Users/laksh/Desktop/Resonance/TRD.md) | [architecture.md](file:///c:/Users/laksh/Desktop/Resonance/architecture.md)

---

## 1. Overview & Core Mission
Frontend Engineer 1 is responsible for the entry point of the **Veritas ER / SYNTRA** platform. This includes building seamless drag-and-drop file upload capabilities, authentication flows, data source metadata management, and the shared layout design system (navigation headers, sidebars, and base styles).

---

## 2. Direct Folder & File Ownership

### 📁 Owned Files & Components
```text
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx              # User authentication page
│   │   └── Upload.jsx             # Multi-source dataset ingestion page
│   ├── components/
│   │   ├── UploadBox.jsx          # Drag-and-drop file upload zone with progress bar
│   │   ├── SourceCard.jsx         # Data source trust metadata card (reliability score, record count)
│   │   ├── Navbar.jsx             # Top application header bar
│   │   └── Sidebar.jsx            # Application sidebar navigation menu
│   ├── services/
│   │   └── api.js                 # Auth & Upload API client methods (shared with FE2)
│   ├── App.jsx                    # Routing configuration (Ingestion & Auth routes)
│   └── index.css                  # Global Tailwind CSS tokens, theme colors & base components
```

---

## 3. Key Responsibilities & Features

1. **User Authentication & Session Management (`Login.jsx`)**
   - Build responsive login/registration UI forms.
   - Manage local session persistence (Supabase Auth / JWT token handling).

2. **Data Ingestion & File Upload (`Upload.jsx`, `UploadBox.jsx`)**
   - Implement drag-and-drop file dropzone supporting CSV and JSON formats.
   - Show asynchronous file parsing status, upload progress bars, and file preview tables.
   - Validate client-side file formats and payload size limits before sending to backend.

3. **Data Source Metadata Card (`SourceCard.jsx`)**
   - Render metadata for uploaded datasets: `source_id`, `source_name`, `reliability_score`, `upload_timestamp`, and `record_count`.
   - Provide controls to set or update source reliability weightings (e.g., 0.95 for Core Banking vs 0.70 for CSV export).

4. **Shared Layout & Design System (`Navbar.jsx`, `Sidebar.jsx`, `index.css`)**
   - Maintain uniform theme styling using Tailwind CSS.
   - Implement active navigation highlights, mobile drawer toggles, and skeleton shimmer tokens.

---

## 4. API & Integration Handoff Points

- **Consumes Backend APIs** (Built by Backend Engineer):
  - `POST /api/upload`: Upload raw file payload and dataset metadata.
  - `GET /api/upload/sources`: Fetch list of registered data sources.
  - `POST /api/auth/login`: Authenticate user credentials.
- **Handoff to Frontend Engineer 2**:
  - Once data ingestion completes, trigger navigation or state event directing users to `ReviewQueue.jsx` or `Dashboard.jsx`.

---

## 5. Definition of Done (DoD)
- [ ] User can log in and remain authenticated across page refreshes.
- [ ] Upload box allows dragging CSV/JSON files with real-time feedback.
- [ ] Uploaded data sources display correct reliability metrics and metadata cards.
- [ ] All pages adhere to the unified Tailwind theme and pass layout responsiveness tests.
