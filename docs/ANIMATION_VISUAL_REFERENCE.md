# Visual Animation Reference Guide
## Before/After Examples for AI Presenter Enhancements

This document provides visual descriptions and pseudocode for each animation enhancement, helping stakeholders understand the transformation.

---

## Page Transitions

### Current State: Instant Switch
```
[Page A] → [Page B]
(Instant, no transition)
```

### Enhanced State: Smooth Fade & Slide
```
[Page A] → [Fading out + sliding left] → [Page B fading in + sliding from right]
Duration: 600ms
Easing: Power2.easeOut
```

**Visual Description:**
- Current page fades to 0% opacity while sliding 50px left
- New page starts at 0% opacity, 50px right of center
- New page fades to 100% opacity while sliding to center
- Smooth, professional feeling like Apple product pages

**Battery Impact:** Minimal (GPU-accelerated transform + opacity)

---

## Home Page Hero Animation

### Current State: Static Load
```
All elements appear instantly:
- Logo (static)
- Headline (static, or scramble text)
- Social icons (static)
- CTA button (static)
```

### Enhanced State: Orchestrated Entrance
```
Timeline:
0ms    → Background gradient fades in (500ms)
200ms  → Client logo slides in from left (600ms)
400ms  → Headline scramble effect plays (existing)
700ms  → Social icons stagger in from bottom (400ms each, 150ms stagger)
900ms  → CTA button scales in with bounce (500ms)

Total duration: ~1.4 seconds
```

**Visual Description:**
1. Black screen
2. Gradient background fades in elegantly
3. Logo swoops in from left edge
4. Headline letters scramble into place (existing effect)
5. Social icons pop up one by one from bottom with slight bounce
6. CTA button scales from 80% to 100% with elastic bounce

**Inspiration:** Similar to https://www.apple.com/airpods-pro/ hero

**Battery Impact:** Low (one-time on page load)

---

## Dashboard Metric Counters

### Current State: Static Numbers
```
Revenue Growth: 87%
Projects Completed: 142
Client Satisfaction: 95%

(Numbers appear instantly)
```

### Enhanced State: Animated Counting
```
Revenue Growth: 0% → 1% → 5% → 23% → 56% → 87%
(Smooth counting animation over 2 seconds)

Triggered when scrolled into view
Easing: Power1.easeOut (starts fast, slows at end)
```

**Visual Description:**
- User scrolls dashboard into view
- Numbers start at 0
- Numbers rapidly count up, slowing near target value
- Gives impression of "real-time calculation"
- Creates satisfying "achievement unlocked" feeling

**Example Sites:**
- https://www.apple.com/mac-pro/ (performance metrics)
- https://stripe.com/ (transaction counters)

**Battery Impact:** Low (triggered once per scroll)

---

## SWOT Card Interactions

### Current State: Static Grid
```
[Strength 1] [Strength 2]
[Weakness 1] [Weakness 2]
[Opportunity 1] [Opportunity 2]
[Threat 1] [Threat 2]

(All cards visible, no animation)
```

### Enhanced State: Stagger Reveal + Flip Interaction
```
Initial Load:
Card 1 fades in + slides up → (100ms delay) → Card 2 → Card 3 → ...
Each card enters with slight 3D tilt

On Tap/Click:
Card flips 180° on Y-axis to reveal detailed analysis
Back face shows: full description, metrics, recommendations
```

**Visual Description:**

**Initial Appearance:**
- Cards start invisible, 50px below final position
- Cards animate in sequence (stagger effect)
- Each card has subtle shadow and depth

**Interaction:**
- User taps "Strength 1" card
- Card rotates 180° around vertical axis (like flipping a coin)
- Back reveals detailed analysis
- Tap again to flip back to front

**3D Transform:**
```
Front view: rotateY(0deg)
Flipping: rotateY(90deg) [halfway point]
Back view: rotateY(180deg)
```

**Inspiration:**
- iOS Wallet app (card flip)
- https://codepen.io/desandro/pen/LmWoWe

**Battery Impact:** Low-Medium (CSS 3D transforms are GPU-accelerated)

---

## Touch Swipe Navigation

### Current State: Click Arrows
```
[← Previous Button] [Current Page] [Next Button →]

User must:
1. Locate navigation button
2. Aim finger at small target
3. Tap button
```

### Enhanced State: Natural Swipe Gestures
```
Swipe Left → Next Page (with momentum)
Swipe Right → Previous Page (with momentum)

Visual feedback:
- Content follows finger during drag
- Resistance when reaching first/last page
- Snap animation when threshold met
```

**Visual Description:**

**Dragging:**
- User places finger on screen and drags left
- Page content moves with finger (1:1 tracking)
- Shows glimpse of next page underneath
- "Rubber band" resistance if trying to go past last page

**Release:**
- If dragged >150px: page swooshes to next slide
- If dragged <150px: page snaps back to original
- Momentum: Fast swipe requires less distance

**Velocity Detection:**
- Slow swipe: must drag >150px
- Fast swipe (>0.5 velocity): only needs 80px

**Inspiration:**
- iOS home screen navigation
- Instagram Stories swipe

**Battery Impact:** Low (native touch events)

---

## 3D Case Study Charts

### Current State: 2D Recharts Bar Chart
```
   │
95%│     ██████
   │  ██████ ██████
75%│ ████████████████ ██████
   │ ████████████████████████
   └─────────────────────────
     Q1   Q2   Q3   Q4
```

### Enhanced State: Interactive 3D Bar Chart
```
3D View (can rotate with touch):

     Q2 (92%)
        ┃
    Q4  ┃  Q1
   (95%)┃ (85%)
     ┃  ┃  ┃
     ┃  ┃  ┃  Q3 (78%)
     ┃  ┃  ┃   ┃
    ═╬══╬══╬═══╬═════ (ground plane with grid)

Touch & drag to rotate view
Pinch to zoom
Tap bar to see details
```

**Visual Description:**

**Initial View:**
- 3D bars rise from ground plane
- Soft lighting creates shadows
- Labels float above each bar
- Grid on ground for depth perception

**Interactions:**
- Single finger drag: Rotate view around center
- Two finger pinch: Zoom in/out
- Tap on bar: Highlight + show tooltip with details
- Auto-rotate: Slowly rotates when idle (optional)

**Materials:**
- Bars: Glossy, colored material (blue gradient)
- Ground: Dark gray with grid lines
- Labels: White text, always facing camera

**Lighting:**
- Ambient light: 50% (overall illumination)
- Directional light: From top-right (creates depth)
- No shadows (too expensive for battery)

**Inspiration:**
- https://medium.com/cortico/3d-data-visualization-with-react-and-three-js-7272fb6de432
- https://napjose.ph/posts/create-a-3d-contribution-chart-using-react-three-fiber

**Battery Impact:** Medium (limit to 1-2 charts per page)

---

## Particle Background Effect

### Current State: Solid Gradient
```
████████████████████████
████████████████████████ (Static gradient: dark blue → black)
████████████████████████
████████████████████████
```

### Enhanced State: Animated Particle Field
```
  •    ·   •     ·   •      ·
     ·   •    ·      •   ·     •
  ·     •     ·   •      ·
    •     ·   •      ·   •     ·

(500-1000 particles floating, rotating slowly)
(Particles are small dots, blue/white, various opacity)
```

**Visual Description:**

**Particles:**
- 500 particles (high mode), 250 (balanced), 100 (saver mode)
- Size: 2-5px diameter
- Color: Blue (#4A90E2) with 40-80% opacity
- Depth: Scattered in 3D space (-10 to +10 on Z-axis)

**Motion:**
- Entire particle field rotates slowly (0.05 rad/sec)
- No individual particle movement (saves battery)
- Creates gentle, mesmerizing effect

**Rendering:**
- Three.js Points geometry (very efficient)
- No textures (just colored points)
- No shadows or reflections
- GPU shader handles all calculations

**Battery Optimization:**
- Particles reduce automatically when battery low
- Can be disabled entirely in extreme saver mode
- Uses frameloop="demand" when page not active

**Inspiration:**
- https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
- Apple.com ambient backgrounds

**Battery Impact:** Medium (continuous rendering, but optimized)

---

## 3D Competitive Analysis Matrix

### Current State: 2D Competitor Cards
```
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ Competitor  │ │ Competitor  │ │ Competitor  │
│     A       │ │     B       │ │     C       │
│  Strong     │ │  Moderate   │ │  Weak       │
└─────────────┘ └─────────────┘ └─────────────┘
```

### Enhanced State: 3D Scatter Plot Matrix
```
3D Space View:

        │ Market
        │ Share
    ● C │     ● B
        │
   ● D  │         ● A
        │
────────┼──────────────── Innovation →
        │
        │      ● E
        │  ● F
        │
```

**Visual Description:**

**Axes:**
- X-axis: Innovation Score (0-100)
- Y-axis: Market Share (0-100)
- Z-axis: Future Potential (0-100)

**Competitor Nodes:**
- Each competitor is a glowing sphere
- Size indicates company size/revenue
- Color indicates competitive threat:
  - Red: High threat
  - Orange: Medium threat
  - Green: Low threat
  - Blue: Our company

**Interactions:**
- Rotate view by dragging
- Zoom with pinch gesture
- Hover/tap node: Tooltip appears with company details
- Tap node: Expands to show full competitive analysis

**Visual Effects:**
- Nodes glow with emissive material
- Subtle pulse animation on hover
- Connection lines between related competitors (optional)
- 3D grid in background for spatial reference

**Labels:**
- HTML overlays above each node
- Always face camera (billboard effect)
- Show company name + 2 key metrics

**Inspiration:**
- https://github.com/vasturiano/3d-force-graph
- Social network visualizations

**Battery Impact:** Medium-High (limit updates, use demand rendering)

---

## Service Grid Stagger Animation

### Current State: All Appear Instantly
```
[Service 1] [Service 2] [Service 3]
[Service 4] [Service 5] [Service 6]
[Service 7] [Service 8] [Service 9]

(All 9 cards visible immediately on scroll)
```

### Enhanced State: Sequential Reveal
```
Timeline (when scrolled into view):
0ms    → Service 1 fades/slides in
100ms  → Service 2 fades/slides in
200ms  → Service 3 fades/slides in
300ms  → Service 4 fades/slides in
...
800ms  → Service 9 fades/slides in

Total: ~1 second for all cards to appear
```

**Visual Description:**

**Initial State (before scroll):**
- All cards invisible
- Cards positioned 60px below final position
- Cards scaled to 95%

**Animation Sequence:**
- User scrolls grid into view (trigger at 75% viewport)
- Cards animate in sequence (left-to-right, top-to-bottom)
- Each card:
  - Fades from 0% to 100% opacity
  - Slides from 60px below to final position
  - Scales from 95% to 100%
  - 100ms delay between each card

**Easing:**
- Power2.easeOut (starts fast, settles gently)

**Visual Effect:**
- Creates "building up" impression
- Draws eye from left to right
- Feels dynamic and alive

**Inspiration:**
- https://codepen.io/GreenSock/pen/jdawKx
- Modern portfolio websites

**Battery Impact:** Low (one-time animation)

---

## Modal Entrance/Exit Animation

### Current State: Instant Appearance
```
[Main Page]
↓ (instant)
[Modal with backdrop]
```

### Enhanced State: Cinematic Entrance
```
Opening:
0ms    → Backdrop fades from 0% to 80% opacity (300ms)
150ms  → Modal scales from 80% to 100% with bounce (500ms)
         Modal fades from 0% to 100% opacity
         Modal slides from 50px below to center

Closing:
0ms    → Modal scales to 90%, fades to 0% (300ms)
         Modal slides 20px down
100ms  → Backdrop fades to 0% (200ms)
```

**Visual Description:**

**Opening Sequence:**
1. Backdrop (dark overlay) quickly fades in
2. Modal starts small (80% scale), below center
3. Modal zooms to 100% size with elastic bounce
4. Modal simultaneously fades in and rises to center
5. Total duration: ~650ms

**Closing Sequence:**
1. Modal shrinks slightly (to 90%)
2. Modal fades out
3. Modal drops 20px (gives weight)
4. Backdrop fades out
5. Total duration: ~300ms (faster exit)

**Backdrop:**
- Black background with 80% opacity
- Blur effect on background content (optional, expensive)
- Click backdrop to close

**Modal Material:**
- White/dark card depending on theme
- Subtle shadow (elevation)
- Rounded corners
- Smooth edges

**Inspiration:**
- iOS modal presentations
- Material Design modal dialogs

**Battery Impact:** Low (short duration, infrequent)

---

## Touch Ripple Feedback

### Current State: No Visual Feedback
```
[Button]
User taps → (nothing visible) → Action triggers
```

### Enhanced State: Material Ripple Effect
```
User taps → Ripple expands from touch point → Fades out

Visual:
     Tap here
        ↓
   [Button Text]  ← Initial state

   [Button⊙Text]  ← Touch down (ripple starts)

   [Button◎Text]  ← Ripple expanding

   [Button Text]  ← Ripple faded, back to normal

Duration: 600ms
```

**Visual Description:**

**Ripple Properties:**
- Origin: Exact touch/tap point
- Shape: Perfect circle
- Color: White with 30% opacity
- Size: Expands from 0px to 300px diameter
- Opacity: Fades from 30% to 0% while expanding

**Animation:**
- Starts instantly on touch
- Expands outward in circular wave
- Fades out as it expands
- Multiple ripples can overlap if user taps repeatedly
- Ripples are clipped to button boundaries

**Button States:**
- Resting: Normal appearance
- Touching: Ripple visible + slight darkening
- Active: Ripple complete, button depressed slightly

**Inspiration:**
- Material Design ripple effect
- Android button interactions

**Battery Impact:** Minimal (CSS animation, GPU-accelerated)

---

## Blueprint Timeline Animation

### Current State: Static Timeline
```
───●───●───●───●───●───
   Q1  Q2  Q3  Q4  Q5

(All milestones visible immediately)
```

### Enhanced State: Progressive Reveal
```
As user scrolls:

───●            (0% scroll: only Q1 visible)

───●───●        (25% scroll: Q1-Q2 visible)

───●───●───●    (50% scroll: Q1-Q3 visible)

───●───●───●───●───●─── (100% scroll: all visible)

Line "draws" from left to right
Milestone nodes appear sequentially
Details fade in below each node
```

**Visual Description:**

**Timeline Structure:**
- Horizontal line (2px thick, blue)
- Milestone nodes (circles, 40px diameter)
- Connecting line between nodes
- Details card below each node

**Progressive Reveal:**
1. User scrolls to timeline section
2. First node pulses into existence
3. Line "draws" from node 1 to node 2 (like pen drawing)
4. Node 2 appears when line reaches it
5. Detail card fades in below node 2
6. Repeat for remaining nodes
7. Smooth, satisfying progression

**Scroll Behavior:**
- Tied to scroll position (scrub: 1)
- User controls pace by scrolling
- Can scroll up to reverse animation
- Non-blocking (doesn't prevent scrolling)

**Node Details:**
- Circle with gradient fill
- Icon inside (checkmark, clock, etc.)
- Label above: "Q1 2024"
- Description below: Deliverables list

**Alternative (No ScrollTrigger scrub):**
- All animate in sequence on first view
- 2-second total duration
- No scroll coupling

**Inspiration:**
- Process visualization timelines
- Project roadmap animations

**Battery Impact:** Low-Medium (scroll-triggered)

---

## Pinch-to-Zoom on Images

### Current State: Fixed Size Image
```
┌──────────────────┐
│                  │
│   Case Study     │
│      Image       │
│                  │
└──────────────────┘

(Tap does nothing)
(Pinch does nothing)
```

### Enhanced State: Zoomable Image
```
Pinch outward:
┌────────┐ → ┌─────────────┐ → ┌───────────────────┐
│ Image  │   │   Image     │   │     Image         │
└────────┘   └─────────────┘   └───────────────────┘
   1x              1.5x                 3x

Pinch inward:
Returns to 1x zoom

Double tap:
Zoom to 2x at tap point
Double tap again to reset
```

**Visual Description:**

**Gestures Supported:**
- Pinch out: Zoom in (1x to 3x)
- Pinch in: Zoom out (min 1x)
- Drag: Pan when zoomed in
- Double tap: Toggle 2x zoom at tap point

**Visual Feedback:**
- Image smoothly scales during pinch
- Boundaries prevent over-zoom
- Rubber-band effect at min/max zoom
- Shadow/border persists at all zoom levels

**Reset Behavior:**
- Release at <1.2x zoom: snaps back to 1x
- Stay zoomed >1.2x
- Tap outside image: reset to 1x

**Edge Cases:**
- Can't zoom out beyond 1x (no shrinking)
- Can't zoom in beyond 3x (prevents pixelation)
- Panning constrained to image boundaries

**Inspiration:**
- iOS Photos app zoom
- Google Maps pinch zoom

**Battery Impact:** Low (native gesture, GPU transforms)

---

## High Contrast Mode Toggle

### Current State: Single Theme
```
Background: Dark gray (#1a1a1a)
Text: Light gray (#e5e5e5)
Contrast: 4.5:1 (WCAG AA, marginal for sunlight)
```

### Enhanced State: High Contrast Option
```
[Normal Mode Button] [High Contrast Mode Button]

Normal Mode:
Background: Dark gray (#1a1a1a)
Text: Light gray (#e5e5e5)
Contrast: 4.5:1

High Contrast Mode:
Background: Pure white (#ffffff)
Text: Pure black (#000000)
Font weight: 600 (semibold)
Text shadow: 0px 0px 1px black
Contrast: 21:1 (WCAG AAA+, readable in sunlight)
```

**Visual Description:**

**Toggle Button:**
- Location: Top-right corner (persistent)
- Icons: Sun (high contrast) / Moon (normal)
- Size: 56x56px (touch-friendly)
- Tooltip: "High Contrast Mode for Outdoor Use"

**Normal Mode:**
- Modern, sleek design
- Subtle shadows and gradients
- Comfortable for indoor viewing
- Optimized for battery

**High Contrast Mode:**
- Maximum readability
- Stark black on white
- Thick borders (3px instead of 1px)
- Bold fonts (600 weight minimum)
- Removed gradients (solid colors only)
- Increased button padding
- Larger text sizes (+2px)
- Text shadows for depth
- High contrast icons

**Automatic Suggestions:**
- Detect ambient light sensor (if available)
- Suggest high contrast in bright environments
- Remember user preference

**WCAG Compliance:**
- Normal: WCAG AA (4.5:1)
- High contrast: WCAG AAA (7:1+)

**Inspiration:**
- Windows High Contrast mode
- iOS Increase Contrast setting

**Battery Impact:** Minimal (CSS changes only)

---

## Animation Performance Modes

### Battery-Aware Adaptation

```
Battery Level → Animation Behavior

100-50% (High Mode):
• All animations enabled
• 1000 particles
• 60 FPS target
• All 3D scenes active
• Full visual effects

50-20% (Balanced Mode):
• Animations simplified
• 500 particles
• 30-60 FPS target
• Selective 3D scenes
• Reduced effects

<20% (Saver Mode):
• Minimal animations
• 100 particles
• 30 FPS target
• No 3D scenes
• Essential transitions only
```

**Visual Changes by Mode:**

**High Mode:**
- Particle backgrounds: 1000 particles, full motion
- Page transitions: Full 600ms with easing
- 3D charts: All features enabled
- Scroll effects: All parallax and reveals
- Hover effects: Enabled

**Balanced Mode:**
- Particle backgrounds: 500 particles, slower motion
- Page transitions: Simplified 400ms
- 3D charts: Reduced lighting, no shadows
- Scroll effects: Essential only
- Hover effects: Reduced

**Saver Mode:**
- Particle backgrounds: 100 particles or disabled
- Page transitions: Simple fade only (200ms)
- 3D charts: Switch to 2D fallback
- Scroll effects: Disabled
- Hover effects: Disabled

**User Notification:**
```
┌─────────────────────────────────┐
│ ⚠ Battery Low (18%)             │
│ Animations reduced to extend    │
│ battery life                     │
└─────────────────────────────────┘

(Dismissible toast notification)
```

**Battery Impact:** Adapts to maintain 3+ hour target

---

## Complete User Journey Example

**Scenario:** Sales presentation at client office (outdoor patio, bright sunlight, no WiFi)

### Step 1: Open Briefcase
```
• Briefcase opens, screen powers on
• App loads instantly (cached by service worker)
• No network needed (offline mode)
```

### Step 2: Activate High Contrast
```
• Tap sun icon (top-right)
• Screen switches to black text on white
• All text becomes bold and clear
• Readable in bright sunlight
```

### Step 3: Navigate to Home
```
• Hero animation plays:
  - Gradient fades in
  - Logo slides in elegantly
  - Headline letters scramble
  - Icons bounce in sequentially
• Client sees professional, polished intro
```

### Step 4: Swipe to Dashboard
```
• Swipe left gesture
• Page smoothly transitions
• Metric numbers count up from 0 to targets
• Client sees impressive statistics come alive
```

### Step 5: View 3D Case Study
```
• Swipe to case studies
• 3D bar chart renders
• Client drags finger to rotate chart
• Taps bar to see quarterly details
• Engagement increases with interaction
```

### Step 6: Examine Competitive Analysis
```
• Swipe to diagnostic page
• SWOT cards stagger into view
• Client taps "Strengths" card
• Card flips to reveal detailed analysis
• 3D competitor matrix appears
• Client rotates to see positioning
```

### Step 7: Battery Management
```
• After 2 hours, battery at 40%
• System automatically reduces particles
• 3D effects simplified
• Still fully functional
• Presentation continues smoothly
```

### Step 8: Closing
```
• Swipe to call-to-action page
• Final animation: CTA button pulses
• Client impressed by polish and tech
• Close briefcase, presentation saved locally
```

**Result:**
- Professional, memorable presentation
- Client engagement through interaction
- No technical issues (offline, battery-optimized)
- Differentiated from competitor PDFs
- Positive impression created

---

## Comparison to Competitor Approaches

### Standard PowerPoint/PDF
```
• Static slides
• Click to advance
• 2D charts only
• No touch gestures
• Requires clicker device
• No interactivity
```

### AI Presenter (Current)
```
• Web-based, responsive
• Touch to navigate
• 2D charts with hover
• Some animations (framer-motion)
• Works offline
• Client-specific content
```

### AI Presenter (Enhanced)
```
• Web-based, highly interactive
• Swipe to navigate (feels native)
• 3D interactive charts
• Professional GSAP animations
• Touch-optimized gestures
• Works offline with service worker
• Battery-aware performance
• High contrast for outdoor use
• Client-specific content
• Feels like premium iOS app
```

**Competitive Advantage:**
The enhanced version feels more like a custom-built iPad app than a website, creating a premium brand impression and differentiating from standard presentation tools.

---

## Technical Animation Specifications

### GSAP Animation Standards

**Timing:**
- Micro-interactions: 200-400ms
- Page transitions: 400-600ms
- Stagger delays: 100-150ms between items
- Total sequence: <2 seconds

**Easing Functions:**
- Entrances: `power2.out` or `back.out(1.2)`
- Exits: `power2.in`
- Interactions: `power2.inOut`
- Elastic: `elastic.out(1, 0.3)` (use sparingly)

**Properties:**
- Favor: `x, y, scale, opacity, rotation`
- Avoid: `left, top, width, height`
- Always GPU-accelerated transforms

### Three.js Rendering Standards

**Geometry:**
- Max polygons per scene: 10,000
- Prefer low-poly: Sphere(1, 16, 16) not Sphere(1, 64, 64)
- Use instancing for repeated objects

**Materials:**
- Prefer: `MeshBasicMaterial` (no lighting calculations)
- Acceptable: `MeshLambertMaterial` (simple lighting)
- Avoid: `MeshStandardMaterial` (expensive PBR)

**Lighting:**
- Max 2 lights per scene
- Disable shadows
- Use ambient + directional only

**Rendering:**
- Target 30-60 FPS
- Use `frameloop="demand"` for static scenes
- Implement manual invalidation

### Touch Gesture Standards

**Tap Targets:**
- Minimum: 44x44px
- Recommended: 56x56px
- Ideal for 27": 64x64px

**Response Time:**
- Visual feedback: <100ms
- Action execution: <200ms

**Gesture Recognition:**
- Swipe threshold: 150px (or 80px at high velocity)
- Pinch: 1x to 3x zoom range
- Long press: 500ms hold
- Double tap: <300ms between taps

---

## Conclusion

These enhancements transform the AI Presenter from a functional web application into a premium, interactive presentation platform that rivals custom native applications. The combination of GSAP's professional animations, Three.js's immersive 3D visualizations, and thoughtful touch interactions creates a memorable experience that differentiates your presentations from competitors.

**Key Principles Demonstrated:**
1. Animations enhance, never distract
2. Performance and battery efficiency maintained
3. Progressive enhancement (works without animations)
4. Touch-first design for natural interaction
5. Accessible and readable in all conditions

---

**For Implementation Details:** See `docs/LG_STANDBYME_ENHANCEMENT_PLAN.md`
**For Quick Start Guide:** See `docs/QUICK_START_ANIMATIONS.md`
**For Executive Summary:** See `docs/ANIMATION_ENHANCEMENT_SUMMARY.md`
