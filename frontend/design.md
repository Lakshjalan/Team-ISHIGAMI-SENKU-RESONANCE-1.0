---
name: Obsidian Vanguard
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#313030'
  tertiary-container: '#e5e2e1'
  on-tertiary-container: '#656464'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c8c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474746'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Libre Caslon Text
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Libre Caslon Text
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
  headline-lg-mobile:
    fontFamily: Libre Caslon Text
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Libre Caslon Text
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 20px
  margin-desktop: 48px
  margin-mobile: 16px
---

## Brand & Style

This design system combines the sophisticated, high-contrast dark tones of **Obsidian Vanguard** with an ultra-refined, fluid, and tactile component geometry inspired by modern next-generation AI studio dashboards.

The aesthetic transitions from rigid industrial blocks to a **Fluid Bento-Box Architecture**. Interfaces are organized into soft, floating modular pods, organic squircle enclosures, frosted glass overlays, and rounded pill controls. The atmosphere remains authoritative and deeply focused through the monochromatic dark palette, but gains effortless elegance through hyper-smooth curvature, breathable inner padding, and layered floating micro-surfaces.

## Colors

The color palette remains strictly anchored to the Obsidian Vanguard token system:

- **Primary Canvas:** `surface` (#131313) and `background` (#131313) form the seamless backdrop.
- **Card Enclosures & Modules:** Built using tiered tonal containers (`surface-container-low` #1c1b1b, `surface-container` #201f1f, and `surface-container-high` #2a2a2a).
- **Interactive Accents & Hero Typography:** `primary` (#ffffff) for high-emphasis typography, prominent action pills, and gauge indicators.
- **Muted Hierarchy:** `on-surface-variant` (#c4c7c8) and `secondary` (#c7c6c6) for sublabels, timestamps, and secondary status descriptors.
- **Borders & Glass Outlines:** `outline-variant` (#444748) at reduced opacity (30%–50%) for luminous, etched translucent edges.

## Typography

- **Headlines:** **Libre Caslon Text** provides literary authority for primary numerical statements, key metrics, and section titles.
- **Interface & Data:** **Geist** delivers crisp legibility across inputs, pill chips, data tables, and telemetry values.
- **Metric Highlights:** Hero numbers (e.g., percentages, operational speeds) utilize large, clean font scales (`display-lg` and `headline-lg`) paired with compact sans-serif labels.

## Layout & Spacing

- **Bento Pod Matrix:** Fluid modular cards arranged with uniform `20px` to `24px` gutters.
- **Nested Card Architecture:** Cards house secondary floating sub-cards and recessed pill bars with `16px` to `24px` internal padding.
- **Breathing Room:** Generous internal card padding prevents information density from feeling cramped, ensuring every metric feels isolated and distinct.

## Elevation & Depth

- **Frosted Glassmorphism:** Elevated floating badges, nested controls, and popover tags utilize translucent surfaces (`surface-container-highest` with backdrop blur `backdrop-blur-md`).
- **Soft Ambient Glows:** Subtle, diffused drop shadows (`box-shadow: 0 16px 36px -12px rgba(0, 0, 0, 0.6)`) paired with delicate top-edge light highlights.
- **Etched Hairline Borders:** Cards and pills feature a 1px border using `outline-variant` (#444748 at 40% opacity), mimicking precision-milled dark glass.

## Shapes & Geometry

The geometric system abandons sharp 0px corners entirely, adopting the soft, ergonomic radii of the reference dashboard:

- **Dashboard Master Cards:** Large, sweeping rounded corners with **24px to 32px (`rounded-3xl`)**.
- **Nested Sub-Cards & Tiles:** Mid-level pods, chart containers, and list blocks utilize **16px to 20px (`rounded-2xl`)**.
- **Buttons & Action Triggers:** Complete pill geometry with **9999px (`rounded-full`)**.
- **Input Fields & Search Bars:** Fluid capsule format with **9999px (`rounded-full`)** and nested pill action buttons.
- **Chips, Badges & Filters:** Pill-shaped capsules with **9999px (`rounded-full`)**, often housing icon circles and micro-close triggers.
- **Data Visualizations & Gauges:** Smooth circular radial arcs with floating rounded central badges and circular action icons (`rounded-full`).

## Components

- **Primary Buttons:** High-contrast pill buttons (`rounded-full`, bg `primary` #ffffff, text `on-primary` #2f3131) with smooth hover compression and subtle glow.
- **Secondary / Filter Pills:** Capsule tags (`rounded-full`, bg `surface-container-high`, border 1px `outline-variant`) with soft hover brightening.
- **Capsule Input Fields:** Elongated pill input containers (`rounded-full`, bg `surface-container-low`, border 1px `outline-variant`) holding inline text and an internal pill submit button (`Done` / `Run`).
- **Interactive Metric Cards:** Rounded bento pods (`rounded-3xl`, bg `surface-container`) featuring circular gauges, floating pill status indicators, and clean typographic readouts.
- **Floating Badge Overlays:** Frosted floating chips (`rounded-full`, backdrop-blur, subtle inner border) overlaid directly on preview canvases and charts.
- **Segmented Tab Switchers:** Enclosed capsule rail (`rounded-full`, bg `surface-container-lowest`) with sliding pill indicators for switching views smoothly without page jumps.
- **Circular Arc Progress:** Smooth radial progress meters with soft rounded stroke caps (`stroke-linecap: round`) and centered pill/frosted-circle readout badges.
