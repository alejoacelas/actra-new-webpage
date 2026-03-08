# Actra website aesthetic guide

Detailed description of the current actra.ngo visual design, extracted from screenshots and CSS variables for replication in the Astro rebuild.

## Overall impression

The site has a bold, warm, institutional-yet-approachable feel. It uses large typography, strong color blocking, and full-width sections to create visual impact. The design language is modern NGO—serious enough for funders and academics, but warm and human enough for community outreach. It avoids the sterile corporate look by leaning into saturated warm colors (orange) alongside a deep institutional blue.

## Color palette

### Primary colors (from `--wst-*` CSS variables)

| Role | Color | Hex | CSS variable |
|------|-------|-----|-------------|
| Background primary | Warm off-white / cream | `#FFFCF3` | `--wst-color-fill-background-primary` |
| Background secondary | Vivid orange | `#FF6900` | `--wst-color-fill-background-secondary` |
| Accent 1 (deep blue) | Royal/cobalt blue | `#000E99` | `--wst-color-fill-accent-1` |
| Accent 2 (orange) | Same vivid orange | `#FF6900` | `--wst-color-fill-accent-2` |
| Accent 3 (warm brown) | Muted earth brown | `#966B54` | `--wst-color-fill-accent-3` |
| Accent 4 (soft cream) | Light cream | `#FBF6EE` | `--wst-color-fill-accent-4` |
| Text primary | Black | `#000000` | `--wst-color-text-primary` |
| Base 1 (light) | Cream/off-white | `#FFFCF3` | `--wst-color-fill-base-1` |
| Base 2 (dark) | Black | `#000000` | `--wst-color-fill-base-2` |
| Base shade 1 | Warm gray | `#BFBDB6` | `--wst-color-fill-base-shade-1` |
| Base shade 2 | Mid warm gray | `#807E7A` | `--wst-color-fill-base-shade-2` |
| Base shade 3 | Dark warm gray | `#403F3D` | `--wst-color-fill-base-shade-3` |

### Button colors

| State | Fill | Border | Text |
|-------|------|--------|------|
| Primary | `#966B54` (brown) | `#966B54` | `#FBF6EE` (cream) |
| Primary hover | `#000000` (black) | `#000000` | `#FFFCF3` (cream) |
| Secondary | `#FFFCF3` (cream) | `#FFFCF3` | `#000E99` (deep blue) |
| Secondary hover | `#966B54` (brown) | `#FBF6EE` | `#FBF6EE` (cream) |

### Usage patterns observed in screenshots

- **Hero section:** Deep blue (`#000E99`) background with cream/white text, or orange (`#FF6900`) background with white text.
- **Content sections:** Alternate between cream (`#FFFCF3`) background and orange (`#FF6900`) background to create strong horizontal banding.
- **"Get in Touch" / contact section:** Deep blue (`#000E99`) background with white text for the left info panel, white/cream for the form area.
- **Footer / newsletter strip:** Orange (`#FF6900`) background with white text.
- **Subtle tinted sections:** Very light warm cream (`#FFE7BC` / `#FBF6EE`) for stat cards and supporting content areas.

### Color philosophy

The palette is built on three pillars:
1. **Warm cream base** (`#FFFCF3`)—the default background, giving the site a warm, approachable feel vs. stark white.
2. **Vivid orange** (`#FF6900`)—the energetic, action-oriented accent used for CTAs, section backgrounds, and the newsletter bar.
3. **Deep cobalt blue** (`#000E99`)—the institutional, trust-building color used for the hero, contact section, and key headings.

The brown (`#966B54`) serves as a subtle earthy connector between the orange and cream, mainly used on buttons.

## Typography

### Font families

- **Headings:** Questrial (Google Font), sans-serif. A geometric, clean sans-serif with even stroke widths. Gives a modern, friendly, slightly rounded feel.
- **Body text:** Helvetica (via `helvetica-w01-roman`), sans-serif. Standard, readable, neutral.
- **Small text:** DIN Next (`din-next-w01-light`), sans-serif.

### Type scale (from CSS variables)

| Level | Font | Size | Line height | Notes |
|-------|------|------|-------------|-------|
| H1 (observed) | Questrial | 78px | 1.0 | Letter-spacing: -3.9px (tight tracking) |
| H2 | Questrial | 64px | 1.1 | `--wst-font-style-h2` |
| H3 | Questrial | 44px | 1.2 | |
| H4 | Questrial | 32px | 1.4 | |
| H5 | Questrial | 24px | 1.3 | |
| H6 | Questrial | 20px | 1.4 | |
| Body large | Helvetica | 18px | 1.3 | `--wst-font-style-body-large` |
| Body medium | Helvetica | 16px | 1.5 | |
| Body small | Helvetica | 14px | 1.3 | |
| Body x-small | DIN Next Light | 12px | 1.4 | |

### Typography style

- **Headings are very large.** The homepage hero uses ~78px headings, and section titles like "The Problem" and "The Solution" are similarly oversized.
- **Tight negative letter-spacing** on headings (-3.9px on H1, -2.8px on H2) gives a confident, editorial feel.
- **Normal weight (400) throughout.** No bold headings—the size and tracking do the heavy lifting. This is a deliberate design choice that keeps the feel approachable rather than aggressive.
- **All-caps** used for subheadings ("CRIME IS AN UNTREATED ENDEMIC", "OUR APPROACH IS WELL-EVIDENCED") to create hierarchy without increasing font weight.

## Layout patterns

### Page-level structure

The site uses a **full-width section stacking** pattern. Each section spans the entire viewport width with its own background color, creating bold horizontal bands:

```
[Header - cream/transparent background]
[Hero - blue background, large heading + photo]
[Stats bar - cream with 3 stat columns]
[Problem section - cream/light background, text + image side by side]
[Solution section - light cream, same pattern]
[Team section - cream, card-based]
[Endorsements - dark blue banner]
[Contact form - blue sidebar + white form]
[Newsletter - orange banner]
[Footer]
```

### Content width

Content sits within a centered container inside the full-width color blocks. The max content width appears to be ~1200px based on the screenshots.

### Grid patterns observed

- **Hero:** Two-column layout—large heading text on the left, full-height photo on the right.
- **Stats bar:** Three equal columns with large numbers and supporting text.
- **Problem/Solution:** Two-column layouts alternating which side has the image.
- **Team:** Two-column card layout with photos, names, and bios.
- **Services (book-online):** Three-column card grid with photos.
- **Support Us:** Left-side heading text + right-side icon list (4 items with circular orange icons).

### Section spacing

Generous vertical padding between sections—approximately 80–120px top and bottom per section. The site breathes. Content is not crammed.

## Component patterns

### Navigation bar

- Logo (ACTRA mountain logo + "ACTRA" wordmark + "Acción Transformadora" tagline) on the left.
- Three nav links on the right: "Home", "Our Program", "Support Us" in outlined/bordered pill buttons.
- The active page button has a filled dark background (dark blue or black).
- Clean, minimal header on a cream/transparent background.

### Buttons

- **Primary CTA buttons:** Rounded rectangles with the brown fill (`#966B54`), cream text. On hover, transition to black fill.
- **Secondary/outline buttons:** White/cream fill with blue text, transitioning to brown on hover.
- **Nav buttons:** Outlined/bordered pill-shaped buttons.

### Cards

- Team member cards: Photo on top (rounded corners), name, title, and bio below. Clean white/cream background.
- Service cards: Photo on top, title, price, and "Book Now" button below.

### Icons

- The "Support Us" page uses **circular orange icons** with white line-art illustrations inside (person icon, handshake icon, graduation cap icon, dollar sign icon). These appear to be custom or from an icon set, rendered as circles with the orange accent fill.

### Contact form

- Simple form with First Name, Last Name, Email, Message fields.
- Black-bordered input fields on a white background.
- Dark "Send" button.

### Newsletter bar

- Full-width orange background strip.
- White text CTA.
- Email input field + "Sign Up" button.

## Photography style

- Real, candid photos of young people in Latin American contexts (street scenes, group activities, mentoring moments).
- Warm, natural lighting. Not overly polished or stock-looking.
- Photos feature diversity and real-world settings (concrete walls, outdoor spaces, informal group settings).
- The hero image shows two young men in a supportive/friendly pose—communicates connection and community.

## Logo

- Mountain/triangle shape in blue and orange with a sunrise/horizon motif.
- "ACTRA" in bold text next to it.
- "Acción Transformadora" tagline below in smaller text.
- The logo appears in the top-left of every page.

## Responsive behavior

Mobile screenshots show:
- Single-column stacking of all two-column layouts.
- Nav buttons remain visible (not hamburger menu) but smaller.
- Hero heading maintains large size but wraps naturally.
- Section color banding is preserved on mobile.
- Contact form goes full-width.
- Generally clean responsive adaptation with minimal layout changes beyond column stacking.

## Key design principles to replicate

1. **Color blocking:** Full-width sections with bold background colors (cream, orange, blue) creating horizontal rhythm.
2. **Large, confident typography:** Oversized headings with tight tracking, normal weight.
3. **Warm palette:** Cream base instead of white. Orange as the energetic accent. Blue for authority.
4. **Generous whitespace:** Sections breathe with 80–120px padding.
5. **Photo-forward:** Real, warm photography prominently placed.
6. **Simple components:** Minimal decoration. No gradients, shadows, or complex UI. Clean borders and solid fills.
7. **Two-column alternating layouts:** Content + image, switching sides section by section.
