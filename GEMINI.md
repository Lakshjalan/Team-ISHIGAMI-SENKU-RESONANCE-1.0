# Rule: Target Repository Scope & Working Directory

## Mandatory Scope
- **Primary Repository**: All modifications, new code, feature implementations, and file operations MUST be performed exclusively in `/Users/paramjeetkumar/Documents/resonance 1.0` (and its subdirectories: `frontend/`, `backend/`, `ml/`, etc.).
- **No Legacy Folders**: Never perform modifications in legacy or temporary folders such as `RESONANCE`.
- **Command Working Directory**: All shell commands must have their working directory (`Cwd`) set to `/Users/paramjeetkumar/Documents/resonance 1.0` or appropriate subdirectories inside it (e.g. `frontend/`).
- **Repository Integrity**: Keep the root repository structure intact (`frontend/`, `backend/`, `ml/`, `roles/`, `PRD.md`, `TRD.md`, `ROLES.md`, `architecture.md`).
- **Frontend Standards**: Ensure all frontend code adheres to the Obsidian Vanguard design system tokens and passes both `npm run build` and `npm run lint` (`oxlint`) with 0 errors.
