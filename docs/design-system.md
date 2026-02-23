# Atlas Realty — Design System

**Version:** 1.0
**Standard:** Cupertino / Apple Human Interface Guidelines (iOS 26)
**Scope:** Web (Next.js) + Mobile Web (responsive)

---

## 1. Benchmark Findings

Before establishing tokens, key patterns were distilled from the world's leading real estate platforms:

| Platform | Key Takeaway |
|---|---|
| **Zillow** (USA) | Pioneered price-as-pin. Horizontal sticky chip bar for filters. AI natural language search. Horizontal card scroll drawer on map. |
| **Redfin** (USA) | Draw-your-own search polygon. Three-state pin colouring (green/blue/orange). Simple is better — reduced complex colour states after A/B testing. |
| **Rightmove** (UK) | Cluster counting at city zoom, breaks to individual pins on zoom. Search-radius slider for commuter searches. |
| **Housing.com** (India) | Heat map overlays (traffic, lifestyle). Bold neighbourhood colour identity. Short-form vertical video for discovery. |
| **Trulia** (USA) | Neighbourhood data overlays (crime, schools, noise) drive session depth and loyalty. Named "Real Estate App of the Year 2024". |
| **MagicBricks / 99acres** (India) | Builder brand as trust signal on cards. BHK notation. Locality hierarchy in filters. |
| **NoBroker** (India) | Owner-verified vs broker-posted badge as primary trust differentiator. |
| **Apple HIG iOS 26** | Liquid Glass is production-grade for transient chrome (nav, sheets, overlays). Never use on text-heavy content surfaces. Bottom sheet detents (small/medium/large) are the standard map→detail pattern. |

### Design Principles

1. **Map is the product** — location is the primary search act; UI floats over the map, never replaces it
2. **Price pin = search cursor** — price label pins beat location dots; users scan the price landscape before filtering
3. **Bottom sheet as the bridge** — map (base) → mini card → medium detail → full sheet; never navigate away from map for previews
4. **Glassmorphism with rules** — transient surfaces only (nav, sheets, pins); solid backgrounds for text-heavy content
5. **Chip bar beats dropdowns** — horizontal scrolling chips show active state at a glance; one tap to apply/remove
6. **Dual layout, not scaled CSS** — mobile and desktop have genuinely different layouts; desktop gets a persistent results panel

---

## 2. Colour Tokens

### 2.1 Primitives

```
iOS Blue         #007AFF   primary actions, active states, links
iOS Blue Hover   #0071E3   button hover
iOS Blue Active  #0066CC   button pressed
iOS Indigo       #5856D6   secondary accent, premium badge
iOS Teal         #5AC8FA   water/environmental features
iOS Mint         #00C7BE   availability, online status
iOS Green        #34C759   success, low-risk, sold
iOS Orange       #FF9500   warning, medium-risk, price reduced
iOS Red          #FF3B30   error, high-risk, hot listing
iOS Gray 50      #F2F2F7   sheet backgrounds, grouped table bg
iOS Gray 100     #E5E5EA   borders, chip default bg, dividers
iOS Gray 200     #D1D1D6   slider tracks, inactive elements
iOS Gray 300     #C7C7CC   drag handles, tertiary fills
iOS Gray 400     #AEAEB2   placeholder text, disabled
iOS Gray 500     #8E8E93   secondary text, captions, icons
iOS Gray 600     #636366   tertiary text
iOS Gray 700     #48484A   dark body text
iOS Gray 800     #3A3A3C   icon colour, dark tertiary
iOS Gray 900     #2C2C2E   very dark
iOS Gray 950     #1C1C1E   primary text, active pin bg
Map Sand         #E8E0D8   map loading background, page base
```

### 2.2 Semantic Aliases

| Token | Value | Usage |
|---|---|---|
| `primary` | `#007AFF` | All primary buttons, active chips, highlights |
| `primary-hover` | `#0071E3` | Button hover state |
| `primary-active` | `#0066CC` | Button pressed state |
| `success` | `#34C759` | Sold badges, low flood risk |
| `warning` | `#FF9500` | Price reduced, medium flood risk |
| `danger` | `#FF3B30` | Hot listing, high flood risk |
| `label-1` | `#1C1C1E` | Primary text |
| `label-2` | `#3A3A3C` | Secondary headings |
| `label-3` | `#8E8E93` | Tertiary / captions |
| `label-4` | `#AEAEB2` | Placeholder / disabled |
| `fill-1` | `#F2F2F7` | Sheet backgrounds |
| `fill-2` | `#E5E5EA` | Chip default bg, dividers |
| `fill-3` | `#D1D1D6` | Slider tracks |
| `fill-4` | `#C7C7CC` | Drag handles |
| `separator` | `rgba(60,60,67,0.29)` | HIG-exact separator lines |
| `glass-bg` | `rgba(255,255,255,0.82)` + `backdrop saturate(180%) blur(20px)` | All glass surfaces |

### 2.3 Neighbourhood Zone Palette

6 colours rotating across Chennai's 20 seed neighbourhoods, grouped by geographic zone:

| Zone | Colour | Neighbourhoods |
|---|---|---|
| East Coast (seafront) | Teal `rgba(90,200,250,0.12)` / `#0071A4` | Adyar, Mylapore, Besant Nagar, Thiruvanmiyur |
| Central (old city) | Indigo `rgba(88,86,214,0.12)` / `#3634A3` | T. Nagar, Nungambakkam, Kilpauk |
| North-Central | Purple `rgba(175,82,222,0.12)` / `#8944AB` | Anna Nagar |
| South (IT corridor) | Green `rgba(52,199,89,0.12)` / `#248A3D` | Sholinganallur, Velachery, Perungudi, Pallikaranai, Thoraipakkam, Kelambakkam |
| North (industrial) | Blue `rgba(0,122,255,0.12)` / `#007AFF` | Perambur, Mogappair, Ambattur |
| West (suburban) | Orange `rgba(255,149,0,0.12)` / `#C84B00` | Porur, Tambaram, Chromepet |

### 2.4 Flood Risk Layer

| Risk Level | Fill | Opacity | Stroke | Usage |
|---|---|---|---|---|
| High | `#FF3B30` | 25% | 70% stroke | Adyar River, Cooum, Pallikaranai |
| Medium | `#FF9500` | 18% | 70% stroke | Ambattur Lake, Tondiarpet |
| Low | `#34C759` | 12% | 70% stroke | Future low-risk zones |

---

## 3. Typography Scale

Font stack: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif`

Renders as SF Pro on Apple devices (iOS, macOS, iPadOS) — native, free, zero extra load.

| Level | Size | Weight | Line Height | Tracking | Usage |
|---|---|---|---|---|---|
| `display` | 34px | 700 | 41px | −0.4px | Hero price in full listing detail |
| `title1` | 28px | 700 | 34px | −0.3px | Sheet main price |
| `title2` | 22px | 700 | 28px | −0.2px | Desktop sidebar section headings |
| `title3` | 20px | 600 | 25px | −0.1px | Nav brand name (desktop) |
| `headline` | 17px | 600 | 22px | −0.2px | Filter sheet header, nav brand (mobile) |
| `body` | 17px | 400 | 22px | −0.2px | Long-form body text |
| `callout` | 16px | 400 | 21px | −0.2px | Desktop sidebar card body |
| `subhead` | 15px | 400 | 20px | −0.1px | Secondary info in cards, button labels |
| `footnote` | 13px | 400 | 18px | −0.1px | Captions, stat labels, count badge |
| `caption1` | 12px | 400 | 16px | 0px | Timestamps, secondary captions |
| `caption2` | 11px | 400 | 13px | +0.06px | Section labels (UPPERCASE), small badges |

**Rendering:** `antialiased` on all surfaces.

---

## 4. Spacing Scale (8px Grid)

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Tight icon margins |
| `space-2` | 8px | Compact padding, small gaps |
| `space-3` | 12px | Component internal padding |
| `space-4` | 16px | Standard page margin (mobile) |
| `space-5` | 20px | Sheet horizontal padding |
| `space-6` | 24px | Card padding (desktop) |
| `space-8` | 32px | Section separation |
| `space-10` | 40px | Large structural gaps |
| `space-12` | 48px | Nav height (mobile: 56px, desktop: 64px) |
| `space-20` | 80px | Bottom safe area buffer |

---

## 5. Shadow Levels

Four elevation levels following iOS material hierarchy:

| Level | Value | Usage |
|---|---|---|
| **Level 1** | `0 1px 3px rgba(0,0,0,.10), 0 0 0 0.5px rgba(0,0,0,.06)` | Cards, chips on map |
| **Level 2** | `0 2px 8px rgba(0,0,0,.14), 0 0 0 0.5px rgba(0,0,0,.08)` | Price pins, search bar, buttons |
| **Level 3** | `0 8px 32px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.10)` | Bottom sheets, sidebar panels |
| **Level 4** | `0 16px 64px rgba(0,0,0,.28), 0 4px 16px rgba(0,0,0,.14)` | Modals, dialogs |

Sheet bottom-shadow (upward): `0 -4px 32px rgba(0,0,0,.12), 0 -1px 0 rgba(0,0,0,.04)`

---

## 6. Border Radius Tokens

| Token | Value | Usage |
|---|---|---|
| `radius-xs` | 6px | Small badges, tight chips |
| `radius-sm` | 8px | Small buttons, inline badges |
| `radius-md` | 12px | Map control buttons, stat pills |
| `radius-lg` | 16px | Standard cards, filter chips (large) |
| `radius-xl` | 20px | Large chips |
| `radius-2xl` | 24px | Sheet corners, search bar, CTA buttons |
| `radius-full` | 9999px | Pills, count badges, close buttons |

---

## 7. Animation Tokens

### Easing Curves

| Name | Value | Usage |
|---|---|---|
| `spring` | `cubic-bezier(0.32, 0.72, 0, 1)` | Sheet slide-up/down, sidebar enter (iOS standard) |
| `bounce` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Pin tap spring, chip select |
| `enter` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering (decelerate) |
| `exit` | `cubic-bezier(0.4, 0, 1, 1)` | Elements leaving (accelerate) |
| `ease` | Standard `ease` | General hover states |

### Duration Scale

| Token | Value | Usage |
|---|---|---|
| `micro` | 100ms | Icon swaps, colour transitions |
| `fast` | 200ms | Fade in/out, badge pop |
| `standard` | 300ms | Most transitions |
| `sheet` | 350ms | Bottom sheet slide, sidebar slide |
| `spring` | 600ms | Complex spring physics |

### Named Animations

| Name | Description | Easing | Duration |
|---|---|---|---|
| `slide-up` | Sheet enters from bottom | spring | 350ms |
| `slide-down` | Sheet exits to bottom | exit | 300ms |
| `slide-left` | Right panel enters from right | spring | 350ms |
| `slide-right` | Left sidebar enters from left | spring | 350ms |
| `fade-in` | Element fades in | ease | 200ms |
| `pin-select` | Scale: 1 → 1.2 → 1.12 (bounce) | bounce | 300ms |
| `drag-pulse` | Drag handle width breathes (idle) | ease | 2s loop |
| `count-change` | Count number updates (slide up) | enter | 200ms |
| `scale-in` | Element scales in from 92% | spring | 350ms |

---

## 8. Breakpoints

| Name | Range | Tailwind prefix | Layout |
|---|---|---|---|
| Mobile | 0 – 767px | (default) | Full-screen map, bottom sheets, floating chips |
| Tablet | 768 – 1199px | `md:` | Same as mobile (bottom sheets) |
| Desktop | ≥ 1200px | `lg:` | Split-screen 65/35, sidebar panels, inline nav search |
| Wide | ≥ 1440px | `xl:` | Wider content columns |

**Design principle:** Mobile and desktop have genuinely different layouts. Desktop is not just "wider mobile".

---

## 9. Z-Index Scale

| Token | Value | Usage |
|---|---|---|
| `z-map` | 0 | MapLibre GL canvas |
| `z-layer` | 10 | GeoJSON overlay layers (flood, etc.) |
| `z-pin` | 15 | Price pin markers (MapLibre manages) |
| `z-ui-base` | 20 | Nav bar, search bar, layer controls, desktop panels |
| `z-scrim` | 30 | Sheet backdrop (transparent scrim) |
| `z-sheet` | 40 | Bottom sheets (filter, listing detail) |
| `z-toast` | 50 | Toast notifications (future) |
| `z-modal` | 60 | Full modal dialogs (future) |

---

## 10. Component Specifications

### 10.1 Navigation Bar

| Attribute | Mobile (< 1200px) | Desktop (≥ 1200px) |
|---|---|---|
| Height | 56px (`h-14`) | 64px (`h-16`) |
| Layout | Logo → spacer → List Property + hamburger | Logo → search bar (480px) → nav links → Sign In → List Property |
| Search | Hidden | Inline glass pill, 480px max-width |
| Nav links | Hidden | Buy · Rent · Projects |
| Glass | Yes — `backdrop saturate(180%) blur(20px)` | Yes |
| Sign In | Hidden | `text-[#007AFF] text-[15px] font-medium` |
| List Property | `px-3 py-1.5 text-[14px]` (compact) | `px-5 py-2.5 text-[15px]` |
| Hamburger | Visible | Hidden |

### 10.2 Search Bar

| Attribute | Mobile | Desktop |
|---|---|---|
| Position | Below nav, full-width glass pill | Inside nav, 480px centered |
| Debounce | 300ms | 300ms |
| Active state | Blue ring `rgba(0,122,255,0.10)` | Blue ring |
| Clear button | `XCircle` lucide icon | `XCircle` lucide icon |
| Placeholder | "Search by area, project, or address…" | "Search Chennai properties…" |
| Visibility | Always visible | `lg:flex` inside nav only |

### 10.3 Price Pins (Map Markers)

| State | Appearance |
|---|---|
| Default | White pill, `#1C1C1E` text, Level 2 shadow |
| Hover | `scale(1.1)`, deeper shadow, `z-index: 10` |
| Active/Selected | `#1C1C1E` bg, `white` text, `scale(1.12)`, `pinSelect` bounce animation, `z-index: 20` |
| Enhanced | Two-span layout: beds (11px gray) + price (13px bold) |
| Flood-high | Red `2px` bottom border |
| Flood-medium | Orange `2px` bottom border |

**Pin HTML structure (enhanced):**
```html
<div class="price-pin price-pin--enhanced">
  <span class="pin-beds">3🛏</span>
  <span class="pin-price">₹85L</span>
</div>
```

**Cluster pin (future — CSS class defined):**
Blue circle, white count text, pulsing ring shadow. Breaks into individual pins on zoom ≥ 14.

### 10.4 Filter Sheet

| Attribute | Mobile | Desktop |
|---|---|---|
| Position | `fixed bottom-0`, slides up | `fixed left-0 top-16`, slides right |
| Width | Full-width (max-w-2xl) | 320px |
| Animation | `animate-slide-up` | `animate-slide-right` |
| Corners | `rounded-t-3xl` | Square (flush with nav) |
| Drag handle | Animated idle pulse, widens on press | Hidden |
| Backdrop | `bg-black/20 fixed inset-0` | Same |
| Location chips | Colour-coded by neighbourhood zone | Same |
| Property type chips | Icon + label | Icon + label |
| Selected chip | Blue fill + `Check` icon | Same |
| Section label | Gray → blue when category active | Same |
| CTA | Sticky bottom, animated count | Sticky bottom |

### 10.5 Listing Detail Sheet

| Attribute | Mobile | Desktop |
|---|---|---|
| Position | `fixed bottom-0`, slides up | `fixed right-0 top-16`, slides left |
| Width | Full-width (max-w-2xl) | 400px |
| Animation | `animate-slide-up` | `animate-slide-left` |
| Corners | `rounded-t-3xl` | Square |
| Drag handle | Visible | Hidden |
| Image | 160px gradient placeholder | 160px gradient placeholder |
| Neighbourhood | Colour-coded badge | Colour-coded badge |
| Stats row | `overflow-x-auto scrollbar-hide` | Same |
| Price per sqft | Below main price (when area_sqft set) | Same |
| Save button | Heart fill animation on toggle | Same |
| Share button | `Share2` lucide icon | Same |

### 10.6 Layer Controls

| Attribute | Mobile | Desktop |
|---|---|---|
| Position | Bottom-left floating | Bottom-left floating, collapsible |
| Trigger | Always visible chip | `Layers` icon button; expands on tap |
| Active style | `bg-[color]/10 border-[color]/30 text-[color]` | Same |
| Indicator | Pulsing coloured dot | Same |
| Icon | `Waves` (lucide) | Same |

### 10.7 Desktop Results Panel (≥ 1200px only)

Structure:
```
+----------------------------+
| Sticky top: count + sort   |  56px
+----------------------------+
| Quick filter: All/Apt/Villa |  48px
+----------------------------+
| Scrollable listing cards   |  flex-1
|   ListingCard              |
|   ListingCard              |
|   ...                      |
+----------------------------+
```

Switches to full listing detail view when `selectedListing` is set (slides within panel — no sheet needed on desktop).

### 10.8 Listing Card (Desktop)

Horizontal layout, 80px image on left:
```
[Image 80×80] | Price bold · Neighbourhood badge
               | beds · baths · sqft
               | [Heart icon]
```
Selected state: `border-l-4 border-[#007AFF] bg-[#F0F7FF]`

---

## 11. Glass Effect Specification

```css
/* Light glass (nav, search, chips, panels over map) */
.glass {
  background: rgba(255, 255, 255, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}

/* Dark glass (future dark mode) */
.glass-dark {
  background: rgba(28, 28, 30, 0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
}
```

**Rules:**
- ✅ Use on: nav bar, search bar, price pins, layer controls, listing count badge
- ✅ Use on: sheet overlays (backdrop of sheet, not content area)
- ❌ Never use on: text-heavy content areas (listing details, filter lists)
- ❌ Never use on: data tables, price history, floor plans
- Always verify WCAG AA contrast (4.5:1 minimum) on glass surfaces

---

## 12. Extending the Design System

### Adding a new map layer

1. Add GeoJSON to `backend/layers/`
2. Add API endpoint in `backend/main.py` (copy flood endpoint pattern)
3. Add entry to `LAYERS` array in `frontend/components/Map/LayerControls.tsx`
4. Add `useEffect` block in `MapCanvas.tsx` watching `activeLayers`
5. Document the layer in `docs/features/`

### Adding a new neighbourhood

1. Add to `LOCATIONS` in `frontend/constants/filters.ts`
2. Add a seed row in `data/migrations/` (or a new migration file)
3. Add to `NEIGHBORHOOD_STYLES` in `frontend/constants/neighborhoods.ts` — assign to nearest zone colour

### Future: BHK search (Indian standard)

BHK = Bedrooms, Hall, Kitchen. Replace the current "Beds" filter chip with:
```typescript
// constants/filters.ts
export const BHK_OPTIONS = [
  { key: "1bhk", label: "1 BHK", beds: 1 },
  { key: "2bhk", label: "2 BHK", beds: 2 },
  { key: "3bhk", label: "3 BHK", beds: 3 },
  { key: "4plus", label: "4+ BHK", beds: null, bedsMin: 4 },
];
```
Backend: add `beds_min` / `beds_max` query params to `/api/listings`.

### Future: Dark mode

All semantic tokens have dark equivalents. Swap:
- `.glass` → `.glass-dark`
- `fill-1` (#F2F2F7) → `#1C1C1E`
- `fill-2` (#E5E5EA) → `#2C2C2E`
- `label-1` (#1C1C1E) → `#FFFFFF`

Implement via `class="dark"` on `<html>` and CSS custom properties in `globals.css`.

---

## 13. Accessibility

- **Contrast**: All text on glass surfaces must meet WCAG AA (4.5:1 normal, 3:1 large text)
- **Touch targets**: Minimum 44×44pt on mobile (per HIG); all interactive elements meet this
- **Focus states**: Visible keyboard focus rings on all interactive elements
- **Screen readers**: All icon-only buttons have `aria-label`; price pins have `aria-label` with full price
- **Motion**: Respect `prefers-reduced-motion` — animations should gracefully degrade to instant transitions
- **Colour**: Never use colour alone to convey information — flood zones use both colour and labels

---

*Last updated: Phase 1 build — Atlas Realty v0.2*
*Benchmark sources: Zillow, Redfin, Rightmove, Housing.com, Trulia, MagicBricks, NoBroker, Apple HIG iOS 26*
