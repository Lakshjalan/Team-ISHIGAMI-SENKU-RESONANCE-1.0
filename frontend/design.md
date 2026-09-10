---
name: Obsidian Vanguard
version: 2.0.0
brand: SYNTRA (formerly Reconcile.ai / Veritas ER)
colors:
  # Canvas & Surface System
  background: '#131313'
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  surface-variant: '#353534'
  surface-tint: '#c6c6c7'

  # On-Surface Typography & Icons
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  on-background: '#e5e2e1'

  # High-Emphasis Primary (Monochrome White)
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'

  # Secondary Accents & Muted Controls
  secondary: '#c7c6c6'
  on-secondary: '#303031'
  secondary-container: '#464747'
  on-secondary-container: '#b8b8b8'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'

  # Tertiary Supporting Elements
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'

  # Interactive Fluid Glass Accent (Tactile Controls / Active Sliders)
  accent-interactive: '#007AFF'
  accent-interactive-gradient-start: '#0055ff'
  accent-interactive-gradient-end: '#007AFF'

  # Entity Resolution Triage & Confidence Bands
  confidence-high: '#10b981'          # >= 0.90 (Auto-Merge / Verified Master)
  confidence-ambiguous: '#f59e0b'     # 0.60 - 0.89 (Human-in-the-Loop Triage)
  confidence-low: '#f43f5e'           # < 0.60 (Flagged / Distinct / Reject)

  # Error & Alert Tokens
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'

  # Inverse Surface Tokens
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  inverse-primary: '#5d5f5f'

  # Precision Borders & Outlines
  outline: '#8e9192'
  outline-variant: '#444748'
  border-glass: 'rgba(255, 255, 255, 0.10)'
  border-glass-subtle: 'rgba(255, 255, 255, 0.05)'
  border-glass-active: 'rgba(255, 255, 255, 0.25)'

typography:
  brand-wordmark:
    fontFamily: SyntraFont, Syncopate, sans-serif
    fontSize: 16px
    fontWeight: '300'
    letterSpacing: 0.28em
    textTransform: uppercase
  display-lg:
    fontFamily: Libre Caslon Text, serif
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text, serif
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Libre Caslon Text, serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text, serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Libre Caslon Text, serif
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist, sans-serif
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist, sans-serif
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Geist, sans-serif
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist, sans-serif
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
    textTransform: uppercase
  label-sm:
    fontFamily: Geist, sans-serif
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  mono-code:
    fontFamily: Geist Mono, Space Grotesk, monospace
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px

shapes:
  dashboard-cards: 32px (rounded-3xl)
  sub-cards: 20px (rounded-2xl)
  buttons-pills: 9999px (rounded-full)
  inputs: 9999px (rounded-full)
  badges-chips: 9999px (rounded-full)
  segmented-rails: 9999px (rounded-full)

spacing:
  unit: 8px
  container-max: 1280px
  gutter: 20px
  margin-desktop: 48px
  margin-mobile: 16px
---

# SYNTRA Design System: Obsidian Vanguard

## 1. Brand Identity & Visual Atmosphere

**SYNTRA** (operating the Reconcile.ai / Veritas Entity Resolution engine) represents the pinnacle of enterprise data reconciliation, cryptographic audit verification, and human-in-the-loop AI governance.

The design philosophy unites the dark-toned architectural authority of **Obsidian Vanguard** with an ultra-tactile, fluid component geometry inspired by modern next-generation AI studio cockpits and precision aerospace telemetry interfaces.

### Core Atmospheric Principles
- **Cockpit-Dense Yet Art-Gallery Balanced:** Telemetry readouts, similarity matrices, and cryptographic ledger trees deliver dense operational information without visual clutter, framed by generous internal negative space.
- **Monochromatic Authority:** A pure dark studio canvas anchored at `#131313` with multi-tiered surface containers (`#0e0e0e` to `#353534`). High-contrast pure white (`#ffffff`) serves as the hero typography and focus beacon.
- **Organic Tactility (Fluid Bento & Capsule Geometry):** Replaces harsh 0px industrial corners with swept `rounded-3xl` (24px–32px) bento pods, `rounded-2xl` nested comparison cards, and `rounded-full` (9999px) action pills.
- **Optical Glass & Refraction:** Luminous 1px etched glass hairline borders (`rgba(255,255,255,0.10)`), backdrop blur (`backdrop-blur-md`), and dual intersecting lens refraction brand geometry.
- **Targeted Interactive Accents:** A single vibrant accent—Sapphire / Apple iOS Blue (`#007AFF`) for dynamic liquid controls and sliders—plus calibrated confidence indicators (Emerald, Amber, Rose) exclusively reserved for resolution semantics.

---

## 2. Color Calibration & Semantic Roles

The Obsidian Vanguard token architecture is engineered for OLED contrast ratios, zero eye-fatigue during extended triage sessions, and instant cognitive triage recognition.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        OBSIDIAN VANGUARD CANVAS                        │
│                           #131313 (Base)                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  surface-container-low: #1c1b1b                                  │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │  surface-container: #201f1f (Master Bento Cards)           │  │  │
│  │  │  ┌──────────────────────────────────────────────────────┐  │  │  │
│  │  │  │  surface-container-high: #2a2a2a (Sub-Cards / Rails) │  │  │  │
│  │  │  │  surface-container-highest: #353534 (Pill Badges)    │  │  │  │
│  │  │  └──────────────────────────────────────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Neutral Surface Tiering
- **`background` & `surface` (#131313):** The primary seamless backdrop. Never pure black (`#000000`).
- **`surface-container-lowest` (#0e0e0e):** Recessed telemetry rails, embedded code snippets, and segmented control troughs.
- **`surface-container-low` (#1c1b1b):** Primary section dividers and base wrapper panels.
- **`surface-container` (#201f1f):** Core Bento-Box cards, metric pods, and primary dashboard modules.
- **`surface-container-high` (#2a2a2a):** Nested sub-cards, side-by-side diff comparison panels, and elevated floating drawers.
- **`surface-container-highest` (#353534):** Inactive filter pills, secondary tag backgrounds, and subtle hover targets.
- **`surface-variant` (#353534) & `surface-tint` (#c6c6c7):** Highlighting borders and structural wireframes.

### 2.2 Text & Iconography Hierarchy
- **`primary` (#ffffff):** High-emphasis titles, critical metric values, and active pill backgrounds.
- **`on-surface` (#e5e2e1):** High-legibility primary body text, table row data, and active icons.
- **`on-surface-variant` (#c4c7c8):** Secondary metadata, table column headers, timestamps, and confidence percentages.
- **`secondary` (#c7c6c6):** Inactive tab labels, auxiliary descriptions, and subtle icon strokes.

### 2.3 Interactive Accent & Dynamic Controls
- **`accent-interactive` (#007AFF):** Reserved for interactive tactile controls, active slider knob rings, and liquid glass active tracks.
- **`accent-interactive-gradient`:** `linear-gradient(90deg, #0055ff 0%, #007AFF 100%)` for fluid range indicators with a soft `12px` blue ambient glow.

### 2.4 Entity Resolution Triage Confidence Bands
Confidence scores ($C_{match}$) map to explicit semantic triage colors:
- **High Confidence / Auto-Merged ($C_{match} \ge 0.90$):**
  - Text & Accents: Emerald `#10b981`
  - Chip Background: `rgba(16, 185, 129, 0.12)` with `1px solid rgba(16, 185, 129, 0.28)` border
  - Meaning: Deterministic/high-probabilistic match auto-merged into Golden Master.
- **Ambiguous / Human Triage Queue ($0.60 \le C_{match} < 0.90$):**
  - Text & Accents: Amber `#f59e0b`
  - Chip Background: `rgba(245, 158, 11, 0.12)` with `1px solid rgba(245, 158, 11, 0.28)` border
  - Meaning: Ambiguous conflict requiring human review and LLM explanation inspection.
- **Low Confidence / Flagged / Reject ($C_{match} < 0.60$):**
  - Text & Accents: Rose / Error `#f43f5e` / `#ffb4ab`
  - Chip Background: `rgba(244, 63, 94, 0.12)` with `1px solid rgba(244, 63, 94, 0.28)` border
  - Meaning: Distinct entities, false positives, or anomalous discrepancies.

### 2.5 Precision Glass Outlines
- **`border-glass` (`rgba(255, 255, 255, 0.10)`):** Default hairline card borders.
- **`border-glass-subtle` (`rgba(255, 255, 255, 0.05)`):** Nested row and table dividers.
- **`border-glass-active` (`rgba(255, 255, 255, 0.25)`):** Focused inputs, active cards, and spotlight borders.

---

## 3. Typographic Architecture

The typographic hierarchy pairs literary serif authority with ultra-crisp neo-grotesque sans and monospace telemetry.

| Role | Font Family | Weight | Size / Line-Height | Tracking / Style | Usage |
|---|---|---|---|---|---|
| **Brand Wordmark** | `SyntraFont`, `Syncopate` | 300 Light | 16px / 20px | `0.28em`, Uppercase | Application header logo and brand title |
| **Display Hero** | `Libre Caslon Text` | 700 Bold | 64px / 72px | `-0.02em` | Main dashboard hero stats, splash headers |
| **Headline Large** | `Libre Caslon Text` | 600 SemiBold | 40px / 48px | `-0.01em` | Primary section headers, modal master titles |
| **Headline Medium** | `Libre Caslon Text` | 600 SemiBold | 24px / 32px | `normal` | Bento pod headers, triage card candidate titles |
| **Headline Small** | `Libre Caslon Text` | 600 SemiBold | 20px / 28px | `normal` | Sub-card group titles, metric pod labels |
| **Body Large** | `Geist` | 400 Regular | 18px / 28px | `normal` | LLM reasoning explanations, editorial intros |
| **Body Medium** | `Geist` | 400 Regular | 16px / 24px | `normal` | Default body copy, form inputs, dialog text |
| **Body Small** | `Geist` | 400 Regular | 14px / 20px | `normal` | Data table cells, list items, description tags |
| **Label / Tag** | `Geist` | 600 SemiBold | 12px / 16px | `0.08em`, Uppercase | Status chips, confidence badges, table headers |
| **Micro Label** | `Geist` | 600 SemiBold | 11px / 14px | `0.06em`, Uppercase | Micro badges, source weight pill descriptors |
| **Mono Telemetry** | `Geist Mono`, `Space Grotesk` | 400 / 500 | 13px / 18px | `normal` | SHA-256 hashes, record IDs, timestamps |

---

## 4. Component Geometry & Shapes

Every visual element follows an ergonomic, pill-forward geometric system:

- **Dashboard Master Cards:** Large sweeping rounded corners: **`32px` (`rounded-3xl`)**.
- **Nested Sub-Cards & Visual Panels:** Mid-level pods, diff containers, and charts: **`20px` (`rounded-2xl`)**.
- **Pill Triggers & Buttons:** Full capsule geometry: **`9999px` (`rounded-full`)**.
- **Input Fields & Search Capsules:** Rounded capsule containers: **`9999px` (`rounded-full`)**.
- **Status Badges & Confidence Chips:** Pill capsules: **`9999px` (`rounded-full`)**.
- **Segmented Control Rails:** Capsule tracks with nested sliding pill chips: **`9999px` (`rounded-full`)**.
- **Gauges & Circular Progress Meters:** Smooth SVG circular arcs with floating rounded central badges and circular action icons (`rounded-full`).

---

## 5. Comprehensive Component Specifications

### 5.1 SYNTRA Brand Mark (`SyntraLogo.tsx`)
- **Geometry:** Two overlapping spheres representing dual entity records undergoing convergence.
- **Top Sphere:** Positioned at `(92, 78)` with `r=54`, radial gradient (`stopColor="#ffffff"`, opacity `0.55` to `0.02`), stroke `rgba(255,255,255,0.45)`.
- **Bottom Sphere:** Positioned at `(132, 118)` with `r=54`, radial gradient (`stopColor="#ffffff"`, opacity `0.05` to `0.65`).
- **Lens Refraction Glow:** Masked intersection circle with high-intensity glow (`stopColor="#ffffff"` with opacity `0.95` down to `0.0`).
- **Wordmark:** Rendered alongside with `.font-syntra` tracking (`0.28em`, uppercase, 300 weight).

### 5.2 Liquid Glass Slider (`LiquidGlassSlider.tsx`)
- **Use Case:** Confidence threshold tuning, weight calibration, and tolerance adjusters.
- **Track:** Capsule bar (`h-4`, `rounded-full`, bg `#131313`, `border: 1px solid rgba(255,255,255,0.10)`, inner shadow `inset 0 2px 4px rgba(0,0,0,0.6)`).
- **Active Liquid Fill:** Dynamic Apple iOS Blue gradient (`linear-gradient(90deg, #0055ff 0%, #007AFF 100%)`) with `0 0 12px rgba(0,122,255,0.4)` glow.
- **Glass Thumb Knob:**
  - Morphing width (`38px` resting, `44px` active/dragging, `h-6`).
  - Transparent glass backdrop (`backdrop-filter: blur(12px)`).
  - Multi-layer optical shadow: `inset 6px 0px 12px -2px rgba(0, 122, 255, 0.6), inset 0px 1px 4px rgba(255, 255, 255, 0.4), 0px 4px 10px rgba(0, 0, 0, 0.4)`.
  - Spring animation: `stiffness: 450, damping: 28, mass: 0.8`.
  - Internal diagonal optical shimmer overlay with subtle pulse.

### 5.3 Spotlight Bento Cards (`.spotlight-card`)
- **Container:** `bg-surface-container` (`#201f1f`) with `rounded-3xl` corners and `border border-white/10`.
- **Hover Physics:**
  - `transform: translateY(-2px)`
  - `border-color: #444748`
  - `box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4)`
  - Transition: `200ms ease-in-out` on transform, border-color, and box-shadow.
  - Zero blur degradation or opacity drops; content remains 100% crisp.

### 5.4 Confidence & Status Badges (`StatusBadge.tsx`)
- **High / Verified (`variant='high'`):** `bg-surface-container-highest text-primary` or emerald pill for auto-merged records.
- **Medium / Ambiguous (`variant='medium'`):** `bg-surface-container-high text-on-surface-variant` with amber indicators.
- **Low / Flagged (`variant='low'`):** `bg-surface-container text-on-surface-variant` with rose alert accents.
- **Neutral (`variant='neutral'`):** `bg-surface-container-highest text-on-surface-variant`.
- **Filled Primary (`variant='filled'`):** `bg-primary text-on-primary font-semibold`.
- **Typography:** `Geist` font, `12px`, uppercase, tracking `0.08em`, `rounded-full` padding `px-2.5 py-0.5`.

### 5.5 Segmented Tab Switchers (`SegmentedTabs.tsx`)
- **Enclosure:** Recessed capsule rail (`bg-surface-container-lowest` `#0e0e0e`, `rounded-full`, `p-1`, border `border-white/5`).
- **Active Pill:** Sliding white/charcoal pill (`bg-surface-container-highest text-primary font-medium shadow-sm rounded-full px-4 py-1.5`).
- **Inactive Tabs:** `text-on-surface-variant hover:text-white transition-colors duration-150`.

### 5.6 Primary & Secondary Action Buttons
- **Primary Action Pill:**
  - Background: `bg-primary` (`#ffffff`)
  - Text: `text-on-primary` (`#2f3131`)
  - Shape: `rounded-full` (capsule)
  - Hover: Scale `1.02`, subtle white ambient halo (`box-shadow: 0 4px 18px rgba(255,255,255,0.15)`)
  - Active: `-1px translate-y` tactile push.
- **Secondary Glass Pill:**
  - Background: `bg-surface-container-high` (`#2a2a2a`)
  - Border: `1px solid rgba(255,255,255,0.12)`
  - Text: `text-on-surface` (`#e5e2e1`)
  - Hover: `bg-surface-container-highest`, border `rgba(255,255,255,0.25)`.

### 5.7 Capsule Search & Filter Inputs (`SearchInput.tsx`)
- **Structure:** Elongated `rounded-full` capsule (`h-11`, `bg-surface-container-low` `#1c1b1b`, `border border-white/10`).
- **Focus Ring:** `border-white/30`, subtle focus shadow `0 0 0 2px rgba(255,255,255,0.08)`.
- **Leading Icon:** Search magnifier in `text-on-surface-variant`.
- **Trailing Action:** Inline micro-pill clear button or shortcut badge (`Ctrl+K`).

### 5.8 Side-by-Side Conflict Triage Cards (`ConflictTriage.tsx`)
- **Layout:** Split two-column grid (`grid-cols-2`) comparing Record Alpha vs Record Beta.
- **Field Diff Highlighting:**
  - Matching fields: Rendered with subdued border and `text-on-surface`.
  - Conflicting fields: Highlighted with subtle amber border (`border-amber-500/30`), soft amber background glow (`bg-amber-500/5`), and conflict indicator pill.
- **AI / LLM Reasoning Card:** Recessed glass callout card with `Geist` body font, displaying match rationale, feature similarity breakdown, and recommended merge resolution.
- **Decision Pill Actions:**
  - `Approve Merge` (Emerald pill)
  - `Reject / Keep Distinct` (Rose/Secondary pill)
  - `Manual Override / Edit Fields` (Glass outline pill)

### 5.9 Cryptographic Audit Ledger Timeline (`AuditLedger.tsx`)
- **Visual Structure:** Vertical node-and-wire chronological rail.
- **Tamper-Evident Hash Capsule:** Monospace pill (`Geist Mono`, `font-mono text-xs`, `bg-surface-container-lowest`, `border border-white/10`, `text-on-surface-variant`) displaying truncated SHA-256 digest (`e.g. 7f3a...b89c`) with one-click copy.
- **Time-Travel Visuals:** Historic state snapshots highlighted with glowing chronological node dots and historical record comparison sliders.

---

## 6. Motion Philosophy & Spring Physics

All interface animation adheres to premium, high-frequency, physics-calibrated interactions using `framer-motion`:

### 6.1 Spring Configurations
- **Tactile Knobs & Sliders:**
  ```javascript
  { type: 'spring', stiffness: 450, damping: 28, mass: 0.8 }
  ```
  Provides immediate responsiveness to pointer drag with a buttery, weighty return.
- **Modals, Drawers & Popovers:**
  ```javascript
  { type: 'spring', stiffness: 300, damping: 30 }
  ```
  Prevents abrupt jarring entrances while avoiding slow linear fades.
- **Segmented Tab Pill Transitions:**
  ```javascript
  { type: 'spring', stiffness: 500, damping: 35 }
  ```
  Fluid, non-elastic horizontal sliding between tab states.

### 6.2 Perpetual Micro-Interactions
- **Active Optical Shimmer:** Subtle diagonal light shimmer on active glass slider thumbs during pointer interaction.
- **Telemetry Pulse:** Micro-pulse dot indicators (e.g. green ping on live Supabase realtime event listener, blue pulse on active pipeline jobs).
- **GPU Acceleration Rule:** All animations execute exclusively via hardware-accelerated properties (`transform` and `opacity`). Never animate `height`, `width`, `top`, or `margin`.

---

## 7. Layout Principles & Responsive Architecture

- **Max Containment:** Inner application views bounded to `container-max: 1280px` with centered alignment.
- **Modular Bento Grid:** Fluid multi-column CSS grid (`gap-5` to `gap-6` / `20px`–`24px`).
- **Generous Internal Padding:** Cards maintain `24px` to `32px` internal padding, preventing metric crowding.
- **Responsive Collapse (< 1024px / Mobile):**
  - Side-by-side triage cards collapse into stacked tabs with quick-toggle switches.
  - Multi-column stats grids collapse to `grid-cols-1` or `grid-cols-2`.
  - Horizontal desktop navigation collapses to mobile drawer.
  - Minimum touch target for all interactive elements: `44px`.

---

## 8. Anti-Patterns & Quality Standards

To maintain a state-of-the-art enterprise aesthetic and eradicate generic AI clichés, the following rules are strictly enforced:

1. **NO Pure Black (#000000):** All dark surfaces must use the calibrated Obsidian spectrum (`#131313`, `#0e0e0e`, `#1c1b1b`, `#201f1f`).
2. **NO Generic Fonts (Inter, Times New Roman, Arial):** Use the curated stack: `Libre Caslon Text` for editorial authority, `Geist` for crisp UI, `SyntraFont`/`Syncopate` for the brand mark, and `Geist Mono` for telemetry.
3. **NO Emojis in Core UI:** Replace all informal emojis with Google Material Symbols or bespoke inline SVGs.
4. **NO Harsh Neon Outer Glows:** Avoid oversaturated purple/blue gradients or generic "AI glow" buttons. Restrict glow effects to soft, tinted diffuse shadows (`rgba(0,122,255,0.4)` on sliders).
5. **NO Generic 3-Equal-Card Rows:** Feature layouts must use asymmetric bento sizing, telemetry headers, or split-screen comparison cards.
6. **NO Circular Generic Spinners:** All asynchronous loading states must use tailored `SkeletonLoader` pods matching the exact geometry of the target card.
7. **NO Fake Placeholder Data:** Record names, emails, addresses, and SHA-256 hashes must adhere to realistic enterprise entity datasets (e.g. banking, healthcare, retail CRM schemas).
