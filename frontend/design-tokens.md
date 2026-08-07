# AIJobPortal Design Tokens (Phase 4)

Source of truth for visual identity. Applied via CSS variables + Tailwind v4 `@theme` in `src/index.css`.

## Brand direction

**Indigo + violet + cyan accent.** Professional SaaS / career-intelligence look.  
Gradients used **sparingly** — hero text, primary CTAs, score rings — not on every card.

---

## Color palette (light)

| Token | Hex | Usage |
|---|---|---|
| `brand` / `primary` | `#4F46E5` | Links, icons, active states |
| `brand-hover` | `#4338CA` | Hover on brand surfaces |
| `brand-muted` | `#E0E7FF` | Soft indigo backgrounds |
| `violet` | `#7C3AED` | Gradient partner / secondary emphasis |
| `accent` / `cyan` | `#06B6D4` | Highlights, score accents (sparingly) |
| `ink` | `#0F172A` | Primary text |
| `ink-muted` | `#64748B` | Secondary text |
| `ink-faint` | `#94A3B8` | Placeholders |
| `canvas` | `#F8FAFC` | Page background |
| `surface` | `#FFFFFF` | Cards / panels |
| `surface-2` | `#F1F5F9` | Nested surfaces |
| `line` | `#E2E8F0` | Borders |
| `success` | `#10B981` | Positive signals |
| `warning` | `#F59E0B` | Warnings / gaps |
| `danger` | `#EF4444` | Errors |

### Gradients (sparingly)

| Name | Value | Use |
|---|---|---|
| Primary | `#4F46E5 → #7C3AED` | Primary CTA, hero brand |
| Accent | `#06B6D4 → #4F46E5` | Score rings, AI highlights |

---

## Color palette (dark)

| Token | Hex |
|---|---|
| `canvas` | `#0B1020` |
| `surface` | `#111827` |
| `surface-2` | `#1E293B` |
| `ink` | `#F8FAFC` |
| `ink-muted` | `#94A3B8` |
| `line` | `#334155` |
| `brand-muted` | `#312E81` |

Toggle via `data-theme="dark"` on `<html>` (persisted in `localStorage`).

---

## Typography

| Role | Family |
|---|---|
| Display / headings | **Space Grotesk** (`@fontsource`) |
| Body / UI | **Inter** (`@fontsource`) |

Type scale unchanged: `display`, `h1`, `h2`, `h3`, `body`, `body-sm`, `label`.

---

## Spacing / radius / elevation

- **8px base** spacing scale  
- **Radius:** 12px everywhere (pills = 9999px for chips only)  
- **Shadows:** `shadow-1`, `shadow-2` only  

---

## Component contracts

See `src/components/ui/` for:

`Button`, `IconButton`, `Input`, `Badge`, `Card`, `StatCard`, `Avatar`, `EmptyState`, `Skeleton`

All support light/dark via CSS variables. Buttons include hover / focus-visible / disabled / loading where applicable.
