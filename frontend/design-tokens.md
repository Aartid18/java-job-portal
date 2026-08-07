# AIJobPortal Design Tokens

Source of truth for visual identity. Applied via Tailwind v4 `@theme` in `src/index.css`.

## Brand direction

**Teal + amber.** Deep teal for structure and trust; amber only for primary CTAs. Warm stone neutrals (not cool slate / pure gray). No indigo, purple, or default blue.

---

## Color palette

| Token | Hex | Usage |
|---|---|---|
| `brand` / `primary` | `#0B5F56` | Links, icons, active states, brand marks |
| `brand-hover` | `#094A43` | Hover on brand surfaces |
| `brand-muted` | `#D8EBE7` | Soft brand backgrounds, chips |
| `accent` | `#E08A1E` | **CTA only** — primary buttons, key actions |
| `accent-hover` | `#C47412` | CTA hover |
| `ink` | `#1A1814` | Primary text |
| `ink-muted` | `#5C574E` | Secondary text |
| `ink-faint` | `#8A8478` | Tertiary / placeholders |
| `canvas` | `#F3F1EC` | Page background |
| `surface` | `#FFFDF9` | Cards / panels |
| `surface-2` | `#EDEAE3` | Nested surfaces, inputs |
| `line` | `#D9D4C8` | Borders / dividers |
| `success` | `#1F7A4D` | Positive match signals |
| `warning` | `#B45309` | Missing critical skills |
| `danger` | `#B42318` | Errors |

---

## Typography

| Role | Family | Notes |
|---|---|---|
| Display / headings | **Space Grotesk** | Self-hosted via `@fontsource/space-grotesk` |
| Body / UI | **Inter** | Self-hosted via `@fontsource/inter` |

### Type scale (rem @ 16px root)

| Token | Size | Line height | Weight | Use |
|---|---|---|---|---|
| `display` | clamp(2.75rem, 7vw, 4.5rem) | 1.05 | 700 | Landing brand |
| `h1` | 2rem (32px) | 1.2 | 700 | Page titles |
| `h2` | 1.5rem (24px) | 1.25 | 600 | Section titles |
| `h3` | 1.125rem (18px) | 1.35 | 600 | Card titles |
| `body` | 1rem (16px) | 1.6 | 400 | Body copy |
| `body-sm` | 0.875rem (14px) | 1.5 | 400–500 | Meta, helpers |
| `label` | 0.75rem (12px) | 1.4 | 600 | Uppercase labels / tracking |

---

## Spacing (8px base)

| Token | Value |
|---|---|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `5` | 24px |
| `6` | 32px |
| `7` | 40px |
| `8` | 48px |
| `9` | 64px |
| `10` | 80px |

Page gutters: `px-4` (16) → `sm:px-6` (24) → `lg:px-8` (32).  
Section vertical rhythm: prefer `py-8` / `gap-6` / `space-y-8`.

---

## Radius

**One radius: 12px** (`--radius: 12px` → `rounded-[var(--radius)]` / utility `rounded-ui`).

Exceptions only for:
- Full pills on tags / score chips → `9999px`
- Icon tiles that must stay square → same 12px

---

## Elevation (3 levels max)

| Level | Token | CSS |
|---|---|---|
| Flat | `shadow-0` | none (default surfaces) |
| Raised | `shadow-1` | `0 1px 2px rgba(26,24,20,0.06), 0 4px 12px rgba(26,24,20,0.04)` |
| Floating | `shadow-2` | `0 4px 8px rgba(26,24,20,0.06), 0 16px 32px rgba(26,24,20,0.08)` |

Hover may promote `shadow-1` → `shadow-2`. No multi-layer glow stacks.

---

## Motion

| Token | Duration | Easing |
|---|---|---|
| Fast | 150ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Base | 250ms | same |
| Slow | 400ms | same |

Allowed motion: page enter, button press, focus ring, mesh parallax on scroll.  
**No** looping particles / floating orbs.

Respect `prefers-reduced-motion`.

---

## Component contracts

### Button
- Primary CTA → `accent` fill, white text, `shadow-1`, radius 12
- Secondary → surface fill, brand text, 1px `line` border
- Soft → `brand-muted` fill, brand text, full width optional
- States: hover (darken + slight lift), active (scale 0.98), focus-visible (2px brand ring offset 2px)

### Input
- Surface fill, 1px `line`, radius 12, focus ring brand
- Height ~40–44px, padding `12px 16px`

### Card / Panel (`.ui-panel`)
- `surface` bg, 1px `line` or subtle border, radius 12, `shadow-1`
- No glassmorphism stacks; slight translucency only on sticky nav

### Focus
- Always visible `:focus-visible` ring — never remove outlines globally
