# Landing Page — Design Override

This file overrides the global MASTER.md for the SignBridge landing page.

## Brand Preservation

The global design system suggested indigo/playful styling. For SignBridge, **preserve the existing mint-green brand identity** defined in the codebase:

| Role | Hex |
|------|-----|
| Primary | `#7BDCB5` |
| Accent/Light | `#F2FBF7` |
| Dark | `#00341B` |
| Background | `#FFFFFF` |

Typography remains **Geist** (already loaded in `src/app/layout.tsx`).

## Landing Page Structure

1. **Navigation** — sticky, blur backdrop, mobile sheet menu, auth-aware CTAs. Direct links: Features, How It Works, Community. Dropdown: About → About ASL, About MSL.
2. **Hero** — value prop + MyBIM collaboration badge + auth-aware CTAs.
3. **Features** — 6 real features mapped to actual app routes:
   - AI Gesture Recognition → `/gesture-recognition/upload`
   - 3D Avatar Generation → `/avatar/generate`
   - Structured Learning → `/learning/materials`
   - Proficiency Tests & Paths → `/proficiency-test/select`
   - Community Contributions → `/gesture/submit`
   - Forum & Chat → `/interaction/forum`
4. **How It Works** — 4-step flow.
5. **Testimonials** — role-based fictional community quotes.
6. **ASL / MSL Info** — alternating image + feature list.
7. **FAQ** — real app-focused questions.
8. **Footer** — feature links, legal links, MyBIM credit.

## Interaction Rules

- No scale transforms on hover (avoid layout shift).
- Use `translateY(-2px)` or shadow lift on cards.
- All clickable cards must have `cursor-pointer`.
- Transitions: 150–300ms.
- Icons: Lucide React only, 24×24 viewBox.
- No emojis as UI icons.
- Respect `prefers-reduced-motion`.

## Auth-Aware CTAs

- Authenticated users see **Dashboard** primary CTA.
- Unauthenticated users see **Sign Up / Login** CTAs.
