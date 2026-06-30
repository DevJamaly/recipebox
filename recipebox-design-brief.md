# recipebox — Design Brief

A reference for the visual identity of **recipebox**, a recipe search app (find, view, and bookmark recipes with adjustable serving sizes). This rebrands the original forkify look from its warm peach palette to a fresh **mint-to-ocean teal** identity.

---

## 1. Brand at a glance

| | |
|---|---|
| **Name** | recipebox (always lowercase in the wordmark) |
| **Tagline** | Find, view, and bookmark recipes with adjustable serving sizes. |
| **Personality** | Fresh, clean, friendly, food-forward |
| **Core idea** | A box that holds your recipes — the "save/bookmark" feature is the heart of the app |

---

## 2. Color system

The whole identity is built around a single signature **gradient** that flows from a minty green into an ocean teal-blue. The lighter green end keeps it appetizing (think herbs/mint) while the cool direction makes it distinct and modern.

### 2.1 Signature gradient

```css
/* Primary 2-stop gradient — use this everywhere forkify used its orange gradient */
--gradient: linear-gradient(to right bottom, #56E0C8, #0E8FB8);

/* Richer 3-stop version — use for the logo badge and large hero fills */
--gradient-rich: linear-gradient(to right bottom, #56E0C8, #1BBEB4, #0E8FB8);
```

Direction is **`to right bottom`** (top-left → bottom-right), matching the original app so nothing else about the layout has to change.

| Token | Hex | Role |
|---|---|---|
| Gradient stop 1 (mint) | `#56E0C8` | Light end of every gradient |
| Gradient stop 2 (teal) | `#1BBEB4` | Middle stop (3-stop version only) |
| Gradient stop 3 (ocean) | `#0E8FB8` | Dark end of every gradient |

### 2.2 Solid brand colors

| Token | Hex | Use |
|---|---|---|
| Primary teal | `#14A8A4` | Solid accents, icon fills, active text |
| Primary deep | `#0E7C86` | Small text / links where more contrast is needed |
| Outline teal | `#0E6E78` | Icon outlines, dividers in the logo mark |
| Wordmark / heading ink | `#173E3A` | The "recipebox" wordmark + display headings |

### 2.3 Neutrals (cool-shifted)

| Token | Hex | Use |
|---|---|---|
| `--color-grey-light-1` | `#F2F9F8` | App background / page surface |
| `--color-grey-light-2` | `#E9F2F1` | Panel / ingredients section background |
| `--color-grey-light-3` | `#C1D4D1` | Hairlines, borders, muted strokes |
| `--color-grey-dark-1` | `#2C4744` | Primary body text |
| `--color-grey-dark-2` | `#5D7672` | Secondary / muted text |
| White | `#FFFFFF` | Cards, search bar, content panels |

### 2.4 Drop-in CSS variables

Paste this over the `:root` block in your base styles (forkify keeps these in `_base.scss`):

```css
:root {
  --color-primary:       #14A8A4;
  --color-grad-1:        #56E0C8;
  --color-grad-2:        #0E8FB8;
  --gradient:            linear-gradient(to right bottom, #56E0C8, #0E8FB8);

  --color-grey-light-1:  #F2F9F8;
  --color-grey-light-2:  #E9F2F1;
  --color-grey-light-3:  #C1D4D1;
  --color-grey-dark-1:   #2C4744;
  --color-grey-dark-2:   #5D7672;
}
```

> The original forkify values you're replacing are roughly: primary `#f38e82`, grad-1 `#fbdb89`, grad-2 `#f48982`, and warm greys (`#f9f5f3`, `#f2efee`, `#d3c7c3`, `#615551`, `#918581`). Confirm exact names against your own `_base.scss` before swapping, since they drive everything below.

---

## 3. Where the gradient is used

From the live app, the signature gradient (or its colors) appears in all of these spots — they update automatically once the variables above are swapped:

- The full-page **background** behind the white app card
- The **search button**
- The **logo badge** (circular mark, top-left)
- The **active / selected recipe** in the results list (left rail)
- The **recipe title overlay** banners on the hero image
- The **bookmark button** (the round button on the recipe)
- The **"recipe ingredients"** section heading and other accent headings
- The green **check icons** next to each ingredient
- The **servings +/−** controls and the clock/people icons

Rule of thumb: anything that was warm orange/coral becomes the teal gradient; anything that was a solid coral accent becomes **Primary teal** (`#14A8A4`), or **Primary deep** (`#0E7C86`) when it's small text that needs to stay legible.

---

## 4. Logo

The mark is a recipe card centered in a box, with a fork and spoon fanning out to the left and right edges, on a gradient badge. Wordmark sits to the right in a rounded script.

| Spec | Value |
|---|---|
| Wordmark font | **Pacifico** (Google Fonts), lowercase |
| Wordmark color | `#173E3A` |
| Badge | gradient circle (`--gradient-rich`), white utensils + card, `#0E6E78` outlines |
| Clear space | Keep padding around the lockup ≥ the height of the box icon |
| Minimum size | Full lockup no smaller than ~120px wide; below that, use the badge-only mark |
| Favicon | Use the simplified mark (no recipe lines / box label) |

**Don't:** stretch or recolor the wordmark, put the dark wordmark on a dark background (use the badge-only or a white version instead), or add effects (shadows/outlines) to the lockup.

### Asset files (already exported)

| File | Use |
|---|---|
| `recipebox-logo.svg` / `.png` | Main header lockup (badge + wordmark) |
| `recipebox-badge.svg` / `.png` | Circular mark only (tight spaces) |
| `recipebox-favicon.svg` | Simplified mark, scalable |
| `favicon.ico` | Browser tab (16/32/48/64 bundled) |
| `recipebox-favicon-180.png` | Apple touch icon |
| `recipebox-favicon-{16,32,48,64}.png` | Raster favicons |

---

## 5. Typography

| Role | Typeface | Notes |
|---|---|---|
| Logo / display script | **Pacifico** | Logo wordmark only |
| UI & body | **Nunito Sans** | Unchanged from the base app; weights 400 / 600 / 700 |

Recipe titles and section headings stay uppercase with letter-spacing, as in the current app — only their **color** changes (to the teal accent / ink), not their font.

---

## 6. Component notes

These carry over from the base app; keep them and just let the new variables flow through.

- **Buttons:** pill-shaped, filled with `--gradient`; white label text; on hover the gradient shifts/darkens slightly.
- **Cards & panels:** white on the cool background, soft shadow (e.g. `0 2rem 5rem rgba(0, 0, 0, 0.06)`), generous rounded corners.
- **Icons:** line-style; fill with **Primary teal** for accent icons (checks, clock, people), white when sitting on a gradient surface.
- **Active states:** selected list items get a subtle `--color-grey-light-2` background plus a teal accent edge.

---

## 7. Quick palette swatch

```
Mint        #56E0C8   ████   gradient light end
Teal        #1BBEB4   ████   gradient mid
Ocean       #0E8FB8   ████   gradient dark end
Primary     #14A8A4   ████   solid accent
Deep teal   #0E7C86   ████   text/links
Ink         #173E3A   ████   wordmark / headings
BG light    #F2F9F8   ████   page background
Text dark   #2C4744   ████   body text
```

*Everything here keeps the original app's layout, spacing, and components intact — only the color identity and logo change.*
