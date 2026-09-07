# Stitch Prompt 03: Human-in-the-Loop Conflict Triage Page

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description
Build a human-in-the-loop conflict triage workspace for resolving ambiguous entity matches (confidence 0.60–0.89).

### Header & Filter Rail
- Title: **"Conflict Review Queue"** (Serif 32px, white).
- Subtitle: "Review high-entropy record pairs, evaluate AI reasoning, and commit golden master resolutions."
- Capsule Filter Rail (`rounded-full`, bg `#1c1b1b`): `ALL CONFLICTS (3,770)` | `HIGH MATCH (80-89%)` | `MEDIUM MATCH (60-79%)` | `SEARCH BY NAME / REG NO`.

### Main Triage Workspace Card (`bg #201f1f`, `rounded-3xl`, p-6)

#### Top Pair Header
- Pair ID: `CONFLICT #CR-9042` | Match Confidence: `89% MATCH` (amber pill badge).
- Source Origins: `Source A: Alumni Portal (75%)` vs `Source B: Campus ERP (88%)`.

#### Side-by-Side Field Difference Table
- 3 Column Grid (`Field Name` | `Source A Record` | `Source B Record`):
  1. **Full Name**: `Rahul Sharma` vs `Rahul Sahrma` (Red highlight on typo `Sahrma`).
  2. **Email Address**: `rahul.sharma@alumni.org` vs `r.sharma@techcorp.io` (Amber highlight).
  3. **Phone Number**: `+91 98765 43210` vs `+91 98765 43210` (Green 100% match badge).
  4. **Registration No**: `2021BTCS042` vs `2021BTCS042` (Green 100% match badge).

#### Custom LLM Reasoning Pod (`bg #2a2a2a`, `rounded-2xl`, p-5)
- Title: **"AI Conflict Arbitrator Explanation"** (Sparkle AI icon).
- Explanation Text: *"High-confidence entity match. Phone number (+91 9876543210) and Registration Number (2021BTCS042) match 100%. The name variation 'Rahul Sahrma' is a transposition typo for 'Rahul Sharma'. Recommended Golden Value: Rahul Sharma."*
- Recommended Golden Payload Pill: `golden_name: Rahul Sharma` | `golden_email: rahul.sharma@alumni.org`.

#### Action Resolution Buttons (Bottom Floating Rail)
- `[ ✓ Approve Golden Merge ]` (White filled pill button).
- `[ ✕ Reject / Mark as Distinct Entities ]` (Outline pill button).
- `[ ✎ Manual Override Fields ]` (Secondary container pill button).
