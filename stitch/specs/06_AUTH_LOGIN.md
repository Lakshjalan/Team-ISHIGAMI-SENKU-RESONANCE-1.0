# Stitch Prompt 06: Authentication & Reset Password Pages

## Design System Reference
- **Theme**: Obsidian Vanguard (#131313 Dark Studio)
- **Primary Serif Font**: Libre Caslon Text
- **Secondary Sans Font**: Geist
- **Shapes**: `rounded-3xl` cards, `rounded-full` capsule buttons

## Screen Description 01: Login Screen (`/login`)
Build a secure, centered authentication card for enterprise operators.

### Centered Login Bento Card (`bg #201f1f`, `rounded-3xl`, max-w 440px, p-8, shadow-2xl)
- Header:
  - Brand Logo: **SYNTRA** (Serif 28px, white).
  - Subtitle: "Enter your enterprise credentials to access identity command mesh."
- Form Fields:
  - Work Email Input Capsule: `[ ✉ operator@enterprise.com ]` (`rounded-full`, bg `#1c1b1b`, border 1px `#444748`).
  - Password Input Capsule: `[ 🔒 •••••••••••• ]`.
- Actions:
  - Remember Me Checkbox & `[ Forgot Password? ]` link.
  - Primary Action Button: `[ Sign In to Command Center → ]` (white filled pill button).
- Divider: `── OR CONTINUE WITH ──`.
- OAuth SSO Pills:
  - `[ 🌐 Google Workspace SSO ]` (`rounded-full`, bg `#2a2a2a`).
  - `[ 🏢 Enterprise SAML 2.0 / Okta ]` (`rounded-full`, bg `#2a2a2a`).

---

## Screen Description 02: Reset Password Screen (`/reset-password`)
Build a 2-step password recovery workflow card.

### Stage 1 Card: Request Recovery Link
- Title: **"Reset Your Password"** (Serif 24px).
- Text: "Enter your work email address to receive a secure password recovery link."
- Email Input Capsule + `[ Send Recovery Link → ]` pill button.

### Stage 2 Card: Set New Password
- Title: **"Create New Password"**.
- New Password Input + Confirm Password Input.
- Interactive Password Strength Meter:
  - 4 Progress Segments (Red/Amber/Green) showing `Entropy: Enterprise Strong`.
- Action: `[ Update Password & Sign In → ]`.
