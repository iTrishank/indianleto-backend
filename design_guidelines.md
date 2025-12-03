# IndianLeto B2B Fashion Catalog - Design Guidelines

## Design Approach
**Reference-Based**: Modern B2B e-commerce platform inspired by Shopify's clean product grids and Alibaba's wholesale quotation patterns, adapted for fashion catalog needs.

**Core Principles**:
- Product-first visual hierarchy emphasizing imagery and pricing clarity
- Professional B2B aesthetic with streamlined quotation workflow
- Generous whitespace for product breathing room
- Clear tier pricing visualization

---

## Typography System

**Font Families** (Google Fonts CDN):
- Primary: Inter (headings, UI elements, pricing)
- Secondary: System stack for body text

**Hierarchy**:
- Hero/Page Titles: text-4xl md:text-5xl, font-bold
- Product Titles: text-xl md:text-2xl, font-semibold
- Section Headers: text-2xl md:text-3xl, font-bold
- Price Display: text-lg md:text-xl, font-bold (primary pricing tier)
- Body Text: text-base, font-normal
- Captions/Labels: text-sm, font-medium
- Form Labels: text-sm, font-semibold, uppercase tracking-wide

---

## Layout System

**Spacing Primitives** (Tailwind units):
- Primary rhythm: 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-20
- Grid gaps: gap-4, gap-6, gap-8

**Container Strategy**:
- Max-width: max-w-7xl (catalog, cart)
- Centered: mx-auto with px-4 md:px-6 lg:px-8
- Product detail: max-w-6xl

**Grid Layouts**:
- Catalog: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Product images: 2-column on desktop (main image + thumbnails)
- Cart summary: Single column stack

---

## Component Library

### Header/Navigation
- Fixed top navigation: sticky top-0 with shadow-sm
- Logo left, floating cart icon right with badge count (absolute positioned pill showing item count)
- Height: h-16 md:h-20
- Cart badge: rounded-full with px-2 py-1, text-xs, positioned top-right of cart icon

### Product Card (Catalog Grid)
- Aspect ratio container: aspect-[3/4] for product image
- Badge overlay (top-left): "Buy 10 Get 1 Free" with rounded-lg px-3 py-1, text-xs font-semibold
- Card structure: image container → title (2 lines max, truncate) → price range display
- Hover: subtle scale transform (scale-105) with transition
- Padding: p-4
- Border: border with rounded-lg

### Product Detail Layout
- Two-column grid: grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12
- Left: Image gallery with main image + thumbnail strip below
- Right: Product info stack (title, SKU, description, measurements table, tier pricing, size selector, quantity, CTA)
- Image gallery: Main image in aspect-[4/5] container, thumbnails in grid-cols-4 gap-2

### Price Tier Display
- Horizontal card layout: flex space-x-4
- Each tier: border rounded-lg p-4, flex-1
- Active tier: ring-2 with distinct styling
- Structure per tier: "Qty range" (text-sm) → Price (text-xl font-bold) → "per piece" (text-xs)

### Measurement Table
- Responsive table with border
- Header row with font-semibold
- Alternating row treatments
- Size column emphasized
- Padding: px-4 py-3 for cells

### Size Selector
- Button group: inline-flex gap-2
- Each size button: px-4 py-2, rounded-md, border
- Selected state: ring-2
- Min width: min-w-[3rem]

### Quantity Input
- Number input with increment/decrement buttons
- Input: w-20 text-center, border rounded
- Button flanks: px-3 py-2 border

### Cart List
- Each item: grid grid-cols-[1fr_auto] md:grid-cols-[auto_1fr_auto_auto] gap-4 items-center
- Item structure: thumbnail (w-20 h-20) → product info → quantity editor → price → remove button
- Divider between items: border-b
- Item padding: py-4 md:py-6

### Quotation Form
- Form layout: space-y-6
- Input groups: space-y-2 (label + input)
- Text inputs: w-full px-4 py-3 border rounded-lg
- Products Summary: readonly textarea rows-6 with subtle backdrop
- Form max-width: max-w-2xl
- Submit button: w-full md:w-auto px-8 py-4, text-lg font-semibold, rounded-lg

### Cart Summary Panel
- Sticky positioning on desktop: sticky top-24
- Border rounded-lg with p-6
- Line items: flex justify-between mb-2
- Total row: border-t pt-4 mt-4, font-bold text-xl

### Footer
- Multi-column: grid-cols-1 md:grid-cols-3 gap-8
- Sections: Company info, Quick links, Contact
- Padding: py-12 px-4
- Copyright bar: border-t pt-6 mt-8, text-sm text-center

---

## Interactive States
- Focus rings: ring-2 ring-offset-2 on all interactive elements
- Button hover: subtle transform translateY(-1px) with shadow increase
- Card hover: transform scale-[1.02] transition-transform
- Disabled states: opacity-50 cursor-not-allowed
- Loading states: Spinner icon with "Processing..." text

---

## Iconography
**Library**: Heroicons (CDN)
- Shopping cart, Plus/Minus (quantity), Trash (remove item), Check (success), X (close/remove)
- Arrow icons for carousel navigation
- Filter icon for catalog filters

---

## Images

### Hero Section (Catalog Page)
Large banner image showcasing wholesale fashion collection:
- Aspect ratio: aspect-[21/9] on desktop, aspect-video on mobile
- Overlay gradient for text legibility
- Centered headline + subheadline + CTA button with backdrop blur (backdrop-blur-sm bg-white/90)

### Product Images
- Use provided product images in aspect-[3/4] containers
- Catalog thumbnails: object-cover with rounded-lg
- Detail page: High-quality display with zoom capability hint
- Image lazy loading: loading="lazy"

### Empty States
- Cart empty: Simple icon + text, centered in min-h-[400px] container

---

## Responsiveness

**Breakpoints** (Tailwind defaults):
- Mobile: base (< 640px) - Single column, stacked layout
- Tablet: md (768px) - 2-column grids, side-by-side forms
- Desktop: lg (1024px) - Full multi-column grids, sticky sidebars
- Large: xl (1280px) - 4-column product grid

**Mobile Adaptations**:
- Navigation: Hamburger menu or simplified horizontal nav
- Product grid: 1 column with larger cards
- Price tiers: Vertical stack instead of horizontal
- Cart items: Stacked layout, thumbnail left-aligned
- Form: Full-width inputs with touch-friendly sizing (min-height: 44px)

---

## Animation Strategy
Minimal, purposeful animations only:
- Transitions: transition-all duration-200 for hover states
- Cart count badge: Simple fade-in when item added
- Form submission: Disable button with spinner, no page-level loaders
- No scroll animations or parallax effects