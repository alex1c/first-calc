# Visual audit

Date: 2026-08-13. Local code/assets only; no production screenshots or visual-regression run was performed.

## Current system

The site has one SVG favicon/logo asset and two local Inter font files (~67 KB total). Most visuals are emoji, inline SVG, gradients, and Heroicons. This keeps image weight low but produces an inconsistent identity: platform-dependent emoji sit beside polished outline icons, category hero illustrations vary by implementation, and cards are visually repetitive.

## Replace or create deliberately

| Priority | Asset/system | Current issue | Recommendation |
|---|---|---|---|
| High | Category icon set | Mixed emoji and inline SVG; appearance varies by OS | Create one small SVG icon family for math, finance, auto, health, everyday, construction, compatibility, tools; consistent stroke, viewBox, and accessible treatment |
| High | Logo/favicon lockup | Only `app/icon.svg`; brand naming varies between First-Calc and Calculator Portal | Keep current mark until branding is approved; then create favicon sizes and a compact wordmark from one source |
| Medium | Open Graph image | No shared social preview system | Create one branded 1200×630 base and optionally category variants; avoid per-calculator AI art |
| Medium | Search/empty/error states | Mostly text-only and English | Use lightweight consistent SVG symbols plus localized helpful actions; no decorative stock imagery |
| Medium | Calculator result visuals | Giant renderer contains bespoke bars/tables with uneven style | Define reusable result card/table/chart primitives before adding images |
| Low | Category hero decoration | Large circular icons/gradients are repetitive and hidden on mobile | Normalize layout and reduce bespoke branches; graphics should clarify category, not fill space |

## Do not generate

- Hundreds of calculator hero images.
- AI-generated construction/medical imagery that could imply technical or clinical authority.
- Random stock photos or placeholders.
- Decorative raster assets that worsen LCP without helping the calculation.

## Typography, spacing, contrast, mobile

- Local Inter Latin/Cyrillic files are appropriately small. Hindi currently relies on a system Devanagari fallback; assess a local Devanagari subset only if Hindi development is approved.
- Blue primary actions and slate footer are broadly coherent. Verify every text/background token with automated contrast tooling; code inspection alone cannot certify contrast.
- Home `text-5xl` and category `text-4xl` headings should use responsive sizes at 320–360 px.
- Standardize card padding/radius/border/hover behavior; current pages mix several nearly identical treatments.
- Icons that are decorative should be `aria-hidden`; meaningful icons need an accessible name supplied by adjacent text.

## Validation required before replacement

Capture representative screenshots at 320, 360, 390, 430, 768, and 1440 px for home, category, a simple calculator, a table-heavy calculator, search modal, article, standard, and legacy page. Approve branding/icon direction before creating final assets. No image generation is necessary for the safe Phase 2 code changes.
