# Stitch Prompt 07: Data Governance & Settings Page

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build a system configuration, algorithm tuning, and team permissions screen.

### Header & Tabs
- Title: **"System Settings & Data Governance"** (Serif 32px, white).
- Subtitle: "Tune identity matching thresholds, configure API keys, and manage operator RBAC roles."
- Segmented Capsule Tab Switcher (`rounded-full`, bg `#1c1b1b`): `MATCHING THRESHOLDS` | `API KEYS & WEBHOOKS` | `TEAM RBAC PERMISSIONS`.

### Tab 1: Matching Engine Thresholds (`bg #201f1f`, `rounded-3xl`, p-6)
- **Auto-Merge Confidence Threshold**:
  - Interactive Slider: Set at `0.90` (90% Confidence).
  - Explanation: Pairs with score $\ge 0.90$ automatically create Golden Records without human intervention.
- **Human Review Triage Band**:
  - Interactive Dual Range Slider: `0.60 to 0.89`.
  - Explanation: Pairs in this band are routed to the `student_conflict_queue`.

### Tab 2: API Keys & Webhooks (`bg #201f1f`, `rounded-3xl`, p-6)
- API Secret Key Card: `veritas_live_key_9f82...` (Click `[ Copy Key ]` or `[ ↻ Revoke ]`).
- Webhook URL Config Capsule: `[ https://api.enterprise.com/webhooks/identity-events ]`.

### Tab 3: Team RBAC Permissions Table (`bg #201f1f`, `rounded-3xl`, p-6)
- Action: `[ + Invite Operator ]` (white pill button).
- User Table: `User Email` | `Role` | `Last Active` | `Actions`.
  1. `laksh@reconcile.ai` | `Super Admin` | `Just Now` | `[ Edit ]`.
  2. `reviewer_1@enterprise.com` | `Triage Reviewer` | `2 hours ago` | `[ Edit ]`.
