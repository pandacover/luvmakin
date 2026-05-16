# luv makin — portfolio redesign spec

## concept

**Direction**: Subterranean editorial. Like a well-worn zine printed on black paper — raw but intentional, typographically obsessive, with just enough brutalism to feel alive. The grain isn't decoration; it's texture, atmosphere, the anti-polish that makes everything feel *real*.

**Unforgettable element**: The hero — your name rendered huge in Sigokae Demo, slightly misaligned vertically like it's floating just off-center, grain breathing over everything. A name that owns the room.

---

## color palette

```css
:root {
  --bg:          #0a0a09;       /* near-black with warmth */
  --bg-surface:  #111110;       /* card/widget surfaces */
  --grain-tint:  #0f0e0c;       /* grain layer base */

  --text-primary:   #e8e4dc;    /* warm off-white, not harsh */
  --text-secondary: #6b6760;    /* muted warm gray */
  --text-tertiary:  #3d3b38;    /* faintest labels */

  --accent:      #c9622a;       /* retained from current — burnt orange */
  --accent-dim:  #7a3a18;       /* dim accent for hover states */

  --border:      rgba(255,255,255,0.06);
  --border-strong: rgba(255,255,255,0.12);
}
```

---

## typography

| Role              | Font              | Weight | Notes                              |
|-------------------|-------------------|--------|------------------------------------|
| Hero name         | Sigokae Demo      | 400    | ~18–22vw, letter-spacing tight     |
| Section headers   | Sigokae Demo      | 400    | ~3.5rem, accent `#` prefix         |
| Body / prose      | `Lora`            | 400    | Serif warmth against the brutalism |
| Labels / nav      | `DM Mono`         | 400    | monospace, matches current DNA     |
| Project titles    | `Lora`            | 600 italic | Elegant contrast                |

**Import**:
```html
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,600&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
```
*(Sigokae Demo loaded locally or via self-hosted CDN.)*

---

## grain effect

SVG-based grain overlay — performant, CSS-only, no canvas needed.

```css
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 999;
  pointer-events: none;
  opacity: 0.038;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 180px 180px;
  mix-blend-mode: overlay;
}

/* animated grain — subtle drift */
@keyframes grain-shift {
  0%, 100% { transform: translate(0, 0); }
  25%       { transform: translate(-2%, 1%); }
  50%       { transform: translate(1%, -2%); }
  75%       { transform: translate(-1%, 2%); }
}

.grain-overlay {
  animation: grain-shift 0.15s steps(1) infinite;
}
```

---

## layout structure

```
┌─────────────────────────────────────────────────┐
│  [grain overlay — fixed, full viewport]          │
│                                                  │
│          ┌──────────────────┐  ← floating nav    │
│          │ [h] home         │    widget, top-right│
│          │ [b] blog         │    corner, fixed   │
│          │ [p] projects     │                    │
│          │ ─────────────    │                    │
│          │ [g] [l] [x]      │                    │
│          └──────────────────┘                    │
│                                                  │
│  ┌─────────────────────────────────────────────┐ │
│  │                  HERO                        │ │
│  │   100vh, centered content                   │ │
│  │                                             │ │
│  │         luv makin                           │ │
│  │      [Sigokae Demo, massive]                │ │
│  │                                             │ │
│  │         frontend engineer ↓                 │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  CONTENT SECTIONS (single column, ~680px max)    │
│  ┌─────────────────────────────────────────────┐ │
│  │ # work                                      │ │
│  │ # blog                                      │ │
│  │ # projects                                  │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## hero section

```
viewport: 100svh
display: flex, align-items: center, justify-content: center
flex-direction: column
text-align: center

Name:
  font: Sigokae Demo, 18vw (clamp to ~220px min, no max on large screens)
  color: var(--text-primary)
  line-height: 0.9
  letter-spacing: -0.03em
  transform: translateY(-0.1em)   ← subtle upward float

Subtitle "frontend engineer":
  font: DM Mono, 0.85rem
  color: var(--text-secondary)
  letter-spacing: 0.18em
  text-transform: lowercase
  margin-top: 1.5rem
  opacity fades in 0.4s after name

Scroll hint:
  bottom: 2rem, centered
  "↓" in DM Mono, var(--text-tertiary)
  slow pulse animation
```

**Hero entrance animation**:
```css
/* Name clips in from bottom */
@keyframes reveal-up {
  from { opacity: 0; clip-path: inset(100% 0 0 0); }
  to   { opacity: 1; clip-path: inset(0% 0 0 0); }
}

.hero-name {
  animation: reveal-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.1s;
  opacity: 0;
}

.hero-subtitle {
  animation: reveal-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  animation-delay: 0.5s;
  opacity: 0;
}
```

---

## floating nav widget

Position: `fixed`, top-right. `margin: 1.5rem`.

```
Visual:
  background: rgba(17, 17, 16, 0.72)
  backdrop-filter: blur(18px) saturate(160%)
  border: 1px solid var(--border-strong)
  border-radius: 10px
  padding: 1rem 1.25rem
  min-width: 160px

  ┌─────────────────┐
  │ [h] home        │
  │ [b] blog        │
  │ [p] projects    │
  │ ─────────────── │
  │ [g]  [l]  [x]   │
  └─────────────────┘

  Keyboard shortcut brackets: DM Mono, var(--accent), 0.7rem
  Nav labels: DM Mono, var(--text-secondary), 0.8rem
  Active page label: var(--text-primary)
  Hover: label shifts to var(--text-primary), no background flash

  Social row: icon glyphs OR text abbreviations spaced evenly
  Separator: 1px solid var(--border), my-0.5rem

Behavior:
  - Enters with a short fade+slide-down on page load (0.3s, delay 0.8s)
  - On scroll down past hero: opacity drops to 0.5, border dims
  - On hover (any part): returns to full opacity instantly
  - Keyboard navigation: pressing [h], [b], [p] routes to sections
```

---

## content sections

**Global content width**: `max-width: 680px`, `margin: 0 auto`, `padding: 0 2rem`.

### section headers
```
# work   /   # blog   /   # projects

  "#" → DM Mono, var(--accent), 1rem, no spacing after
  "work" → Sigokae Demo, 2.8rem, var(--text-primary), letter-spacing: -0.02em
  Combined line-height: 1
  margin-bottom: 3rem
```

### work entry
```
Job title — Company:
  Lora italic 600, 1.15rem, var(--text-primary)

Date range:
  DM Mono, 0.75rem, var(--text-secondary), margin: 0.2rem 0 0.9rem

Description:
  Lora 400, 0.95rem, var(--text-secondary), line-height: 1.7
  max-width: 600px
```

### project card
```
No box/card background. Purely typographic with a subtle left rule.

border-left: 2px solid var(--border-strong)
padding-left: 1.25rem
margin-bottom: 2.5rem

On hover:
  border-left-color: var(--accent)
  transition: 0.2s ease

Project name:
  Lora italic 600, 1.05rem, var(--accent)
  cursor: pointer

Description:
  Lora 400, 0.875rem, var(--text-secondary), line-height: 1.65

Tags/features (bullet list):
  DM Mono, 0.75rem, var(--text-tertiary)
  "— " prefix instead of bullets
```

---

## micro-interactions

| Element             | Interaction                                                   |
|---------------------|---------------------------------------------------------------|
| Nav items           | Underline slides in from left (scaleX 0→1), 0.15s            |
| Project name hover  | Color shifts accent→primary, border pulses                    |
| Scroll              | Section headers fade+slide-up when entering viewport          |
| Hero name           | Subtle letter-spacing eases on mount (tight→normal)           |
| Social links        | Opacity 0.5 → 1.0 on hover, no scale                         |

---

## responsive

| Breakpoint   | Change                                                         |
|--------------|----------------------------------------------------------------|
| < 768px      | Hero name: `clamp(3.5rem, 20vw, 10rem)`                       |
| < 768px      | Floating nav: collapses to icon-only strip, top-right corner  |
| < 480px      | Content padding increases to 1.25rem                          |
| < 480px      | Section header font-size: 2.2rem                              |

---

## implementation notes

- **Framework**: Framework-agnostic; works in Next.js (App Router), Astro, or plain HTML.
- **Grain**: SVG data-URI approach — zero external assets, no canvas perf hit.
- **Sigokae Demo**: Self-host via `@font-face` with `font-display: block` to avoid FOUT on the hero name.
- **Nav keyboard shortcuts**: `document.addEventListener('keydown', ...)` — single listener, route via `scrollIntoView`.
- **Scroll behavior**: `scroll-behavior: smooth` on `html`, paired with `IntersectionObserver` for nav active state.
- **Reduced motion**: Wrap all animations in `@media (prefers-reduced-motion: no-preference)`.

---

## what to keep from current site

- The `[h] [b] [p]` keyboard shortcut nav identity — it's distinctive, keep it.
- The burnt-orange accent color — it reads as a personal signature.
- Lowercase everywhere — tone of voice matches the aesthetic.
- Geist Monospace for structural/label text — grounds the editorial feel.