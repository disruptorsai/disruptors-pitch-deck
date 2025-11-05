# LG StandbyME Go 27LX5 Enhancement Plan
## GSAP + Three.js Integration for AI Presenter

**Document Version:** 1.0
**Created:** January 2025
**Target Device:** LG StandbyME Go 27LX5 (27" Full HD Touchscreen Briefcase Presenter)

---

## Executive Summary

This document provides a comprehensive, actionable enhancement plan to transform the AI Presenter application into a high-performance, visually stunning presentation platform optimized for the LG StandbyME Go 27LX5. By strategically integrating GSAP (GreenSock Animation Platform) and Three.js, we will create impressive animations, 3D data visualizations, and touch-optimized interactions that leverage the device's capabilities while maintaining excellent battery efficiency.

**Key Goals:**
- Enhance presentation impact with professional-grade animations
- Create immersive 3D data visualizations for case studies and metrics
- Optimize all interactions for 27" 1920x1080 touchscreen
- Maintain 3+ hours battery life with GPU-intensive effects
- Ensure webOS TV 22 compatibility (Chrome 68+ browser engine)
- Support outdoor visibility with high-contrast modes
- Enable offline-first presentation capabilities

---

## Table of Contents

1. [Device Specifications & Constraints](#device-specifications--constraints)
2. [Library Recommendations](#library-recommendations)
3. [GSAP Integration Opportunities](#gsap-integration-opportunities)
4. [Three.js Enhancement Plan](#threejs-enhancement-plan)
5. [Touch Gesture Optimization](#touch-gesture-optimization)
6. [Performance & Battery Optimization](#performance--battery-optimization)
7. [webOS Compatibility Considerations](#webos-compatibility-considerations)
8. [Implementation Roadmap](#implementation-roadmap)
9. [Code Examples & Quick Start](#code-examples--quick-start)
10. [Resources & References](#resources--references)

---

## Device Specifications & Constraints

### LG StandbyME Go 27LX5 Technical Specs

**Display:**
- 27-inch touchscreen
- 1920×1080 resolution (Full HD)
- 60Hz refresh rate
- HDR support with Dolby Vision

**Platform:**
- webOS TV 22 (Chrome 68+ browser engine - September 2018)
- Limited to ES2018 JavaScript features
- WebGL 1.0 support (WebGL 2.0 may not be available)

**Performance:**
- Battery: Up to 3 hours continuous use
- Audio: 4-channel Dolby Atmos (20W speakers)
- Connectivity: Wi-Fi 5 (802.11ac), Bluetooth, NFC

**Browser Capabilities:**
- Chromium 68 (for 2020 models) or Chromium 53 (for older models)
- WebGL 1.0 supported
- Service Workers supported
- IndexedDB supported
- Limited modern CSS features (use autoprefixer)

**Critical Constraints:**
1. **Battery Life:** GPU-intensive effects must be optimized to maintain 3+ hour presentations
2. **Browser Limitations:** No ES2019+ features without transpilation
3. **Touch Only:** Remote control navigation may not be primary input
4. **Outdoor Use:** Must work in bright sunlight conditions
5. **Portable:** Must work offline for field presentations

---

## Library Recommendations

### Core Animation & 3D Libraries

#### 1. GSAP (GreenSock Animation Platform) ⭐ **HIGHEST PRIORITY**

**Package:** `gsap` (v3.12+)
**License:** Free for most use cases (Business Green if monetizing)
**Bundle Size:** ~50KB (core)

**Pros:**
- Industry-standard animation library used by Apple, Google, Nike
- Excellent performance (60fps on lower-end devices)
- Touch-friendly with Draggable plugin
- React 18 integration via `@gsap/react` with `useGSAP` hook
- ScrollTrigger works well on touch devices
- Battery efficient (uses requestAnimationFrame intelligently)

**Cons:**
- Some advanced plugins require paid license (Inertia, MorphSVG, DrawSVG)
- Learning curve for timeline sequencing

**Best For:**
- Page transitions between slides
- Scroll-triggered animations on Dashboard and Diagnostic pages
- Micro-interactions on buttons and cards
- Staggered list animations
- Timeline-based presentation sequences

**Installation:**
```bash
npm install gsap @gsap/react
```

**Key Resources:**
- Official Docs: https://gsap.com/docs/v3/
- React Integration: https://gsap.com/resources/React/
- ScrollTrigger Showcase: https://codepen.io/collection/DkvGzg
- Touch Examples: https://gsap.com/docs/v3/Plugins/Draggable/

---

#### 2. React Three Fiber (R3F) + Drei ⭐ **HIGH PRIORITY**

**Packages:** `@react-three/fiber` `@react-three/drei`
**License:** MIT
**Bundle Size:** ~120KB (combined)

**Pros:**
- React 18 native renderer for Three.js (no wrapper overhead)
- Concurrent mode support for smooth performance
- Drei provides pre-built helpers (OrbitControls, Text3D, Loader, etc.)
- Declarative API (easier to learn than vanilla Three.js)
- Excellent performance monitoring via `r3f-perf`
- Active community with tons of examples

**Cons:**
- Adds bundle size (~120KB)
- GPU intensive (must optimize for battery)
- Learning curve for 3D concepts

**Best For:**
- 3D data visualizations (case study metrics, competitive analysis)
- Interactive 3D backgrounds
- Particle effects for hero sections
- 3D product showcases
- Animated logo intros

**Installation:**
```bash
npm install three @react-three/fiber @react-three/drei
```

**Key Resources:**
- Official Docs: https://docs.pmnd.rs/react-three-fiber
- Performance Guide: https://r3f.docs.pmnd.rs/advanced/scaling-performance
- Examples: https://codesandbox.io/examples/package/@react-three/fiber
- Drei Helpers: https://github.com/pmndrs/drei

---

#### 3. @use-gesture/react ⭐ **HIGH PRIORITY**

**Package:** `@use-gesture/react`
**License:** MIT
**Bundle Size:** ~15KB

**Pros:**
- Purpose-built for React touch/mouse gestures
- Handles drag, pinch, wheel, scroll, move events
- Works seamlessly with GSAP and react-spring
- Multi-touch support
- Excellent touch device support

**Cons:**
- Another dependency (but small)

**Best For:**
- Swipe navigation between slides
- Pinch-to-zoom on charts and diagrams
- Drag-to-reorder in admin interfaces
- Pull-to-refresh functionality

**Installation:**
```bash
npm install @use-gesture/react
```

**Key Resources:**
- Official Docs: https://use-gesture.netlify.app/
- Examples: https://codesandbox.io/examples/package/react-use-gesture

---

#### 4. Lottie React (Optional - For Designer Collaboration)

**Package:** `lottie-react`
**License:** MIT
**Bundle Size:** ~30KB

**Pros:**
- Import After Effects animations as JSON
- Lightweight (smaller than GIFs)
- SVG rendering (crisp at any resolution)
- Designer-friendly workflow

**Cons:**
- Requires After Effects + Bodymovin plugin for creation
- Performance issues on very complex animations
- Not as flexible as code-based GSAP

**Best For:**
- Loading animations
- Animated icons
- Explainer animations
- Branded motion graphics

**Installation:**
```bash
npm install lottie-react
```

**Key Resources:**
- LottieFiles: https://lottiefiles.com/
- React Integration: https://lottiefiles.com/blog/working-with-lottie-animations/how-to-use-lottie-in-react-app

---

### Supporting Libraries

#### 5. three-nebula (Particle Effects)

**Package:** `three-nebula`
**License:** MIT
**Bundle Size:** ~25KB

**Pros:**
- High-performance particle system for Three.js
- Designed for WebGL efficiency
- Pre-built emitters and behaviors

**Cons:**
- GPU intensive (use sparingly for battery)

**Best For:**
- Background particle effects
- Transition effects between slides
- Celebration/success animations

---

#### 6. r3f-perf (Performance Monitoring)

**Package:** `r3f-perf`
**License:** MIT
**Bundle Size:** ~10KB

**Pros:**
- Real-time performance monitoring for R3F
- Shows FPS, memory usage, render calls
- Development tool (remove in production)

**Installation:**
```bash
npm install --save-dev r3f-perf
```

---

### AI Code Generation Tools

#### 7. GSAPify Animation Generator

**URL:** https://gsapify.com/gsap-animation-generator
**Type:** Web-based tool
**Cost:** Free tier available

**Features:**
- AI-powered GSAP code generation
- Visual timeline editor
- Live preview
- Export to React code

**Use Case:** Quick prototyping of animation sequences

---

#### 8. GSAP GPT (ChatGPT Plugin)

**URL:** https://www.yeschat.ai/gpts-9t557atEdv9-GSAP-GPT
**Type:** ChatGPT assistant
**Cost:** Free

**Features:**
- GSAP code examples and explanations
- Debugging assistance
- Optimization suggestions
- Timeline sequencing help

---

#### 9. Workik JavaScript Animation Generator

**URL:** https://workik.com/javascript-animation-code-generator
**Type:** AI code generator
**Cost:** Free trial

**Features:**
- Supports GSAP, Anime.js, Three.js
- Framework-aware (React, Vue)
- Generates optimized code

---

### Libraries to AVOID or Use Sparingly

❌ **anime.js** - GSAP is more performant and feature-rich
❌ **Framer Motion** - Already installed, but GSAP is better for complex timelines
❌ **react-spring** - Good, but GSAP has better cross-browser support
❌ **Babylon.js** - Too heavy for battery-powered device (use Three.js)
❌ **WebGL 2.0 features** - May not be supported on webOS TV 22

---

## GSAP Integration Opportunities

### Priority Matrix

| Page/Feature | Priority | Complexity | Impact | Battery Cost |
|--------------|----------|------------|--------|--------------|
| Slide Page Transitions | 🔴 HIGH | LOW | HIGH | LOW |
| Home Page Hero Animation | 🔴 HIGH | MEDIUM | HIGH | LOW |
| Dashboard Metric Counters | 🔴 HIGH | LOW | HIGH | LOW |
| Diagnostic SWOT Cards | 🟡 MEDIUM | MEDIUM | MEDIUM | LOW |
| Case Study Image Reveals | 🟡 MEDIUM | LOW | MEDIUM | LOW |
| Service List Stagger | 🟡 MEDIUM | LOW | MEDIUM | LOW |
| Blueprint Timeline | 🟡 MEDIUM | HIGH | HIGH | LOW |
| ScrollTrigger Effects | 🟢 LOW | MEDIUM | MEDIUM | LOW |
| Drag-to-Reorder Admin | 🟢 LOW | HIGH | LOW | LOW |

---

### 1. Slide Page Transitions (🔴 HIGHEST PRIORITY)

**Current State:** Basic React Router transitions
**Enhancement:** Smooth, professional slide-in/fade transitions between pages

**GSAP Features:**
- Timeline animations
- Ease functions (Power2.easeInOut)
- TransitionGroup integration

**Implementation Location:**
- `src/pages/Layout.jsx` - Wrap route transitions
- Apply to all public presentation routes

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

function PageTransition({ children }) {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.fromTo(containerRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, { scope: containerRef });

  return <div ref={containerRef}>{children}</div>;
}
```

**Battery Impact:** MINIMAL (short-duration animations, GPU-accelerated)
**Estimated Implementation Time:** 2-4 hours

**Real-World Examples:**
- Apple Product Pages: https://www.apple.com/macbook-pro/
- Awwwards Winners: https://www.awwwards.com/websites/gsap/

---

### 2. Home Page Hero Animation (🔴 HIGH PRIORITY)

**Current State:** Static hero section with ScrambleText component
**Enhancement:** Dramatic entrance animation with staggered elements

**GSAP Features:**
- Stagger animations
- Timeline sequencing
- SplitText (optional - paid plugin)

**Implementation Location:**
- `src/pages/Home.jsx`

**Animation Sequence:**
1. Fade in background gradient (0.5s)
2. Slide in client logo from left (0.6s, stagger: 0.1s)
3. Scramble text effect on headline (already implemented)
4. Stagger in social icons from bottom (0.4s, stagger: 0.15s)
5. Fade in CTA button with scale (0.5s)

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

function Home() {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.fromTo('.hero-bg',
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    )
    .fromTo('.client-logo',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 0.6 },
      '-=0.2' // Overlap with previous animation
    )
    .fromTo('.social-icon',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.15 },
      '-=0.3'
    )
    .fromTo('.cta-button',
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5 },
      '-=0.2'
    );
  }, { scope: containerRef });

  return <div ref={containerRef}>...</div>;
}
```

**Battery Impact:** LOW (one-time animation on page load)
**Estimated Implementation Time:** 3-5 hours

**Real-World Examples:**
- GSAP Showcase: https://codepen.io/GreenSock/pen/jdawKx
- Stagger Tutorial: https://codepen.io/GreenSock/pen/GRrQKP

---

### 3. Dashboard Metric Counter Animation (🔴 HIGH PRIORITY)

**Current State:** Static numbers in dashboard cards
**Enhancement:** Animated counting from 0 to target value when scrolled into view

**GSAP Features:**
- ScrollTrigger plugin
- Number interpolation
- Custom ease functions

**Implementation Location:**
- `src/pages/Dashboard.jsx`

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function MetricCard({ value, label }) {
  const numberRef = useRef();
  const [displayValue, setDisplayValue] = useState(0);

  useGSAP(() => {
    gsap.to({ value: 0 }, {
      value: value,
      duration: 2,
      ease: 'power1.out',
      onUpdate: function() {
        setDisplayValue(Math.ceil(this.targets()[0].value));
      },
      scrollTrigger: {
        trigger: numberRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }, { dependencies: [value] });

  return (
    <div ref={numberRef}>
      <div className="text-4xl font-bold">{displayValue}%</div>
      <div className="text-sm">{label}</div>
    </div>
  );
}
```

**Battery Impact:** LOW (triggered once per scroll)
**Estimated Implementation Time:** 2-3 hours

**Real-World Examples:**
- Counter Animation: https://codepen.io/GreenSock/pen/oNYgLZE
- ScrollTrigger Basics: https://codepen.io/GreenSock/pen/PoBdOzX

---

### 4. Diagnostic SWOT Card Flip/Reveal (🟡 MEDIUM PRIORITY)

**Current State:** Static grid of strength/weakness cards
**Enhancement:** Flip cards on tap/click, stagger reveal on scroll

**GSAP Features:**
- 3D transforms (rotateY)
- ScrollTrigger
- Stagger animations

**Implementation Location:**
- `src/components/diagnostic/StrengthWeaknessGrid.jsx`
- `src/pages/Diagnostic.jsx`

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function SwotCard({ title, description }) {
  const cardRef = useRef();
  const [isFlipped, setIsFlipped] = useState(false);

  // Initial reveal animation
  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50, rotateX: -15 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'back.out(1.2)',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Flip animation on click
  const handleFlip = () => {
    gsap.to(cardRef.current, {
      rotateY: isFlipped ? 0 : 180,
      duration: 0.6,
      ease: 'power2.inOut'
    });
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleFlip}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Card content */}
    </div>
  );
}
```

**Battery Impact:** LOW-MEDIUM (uses CSS 3D transforms, GPU-accelerated)
**Estimated Implementation Time:** 4-6 hours

---

### 5. Case Study Modal Entry/Exit (🟡 MEDIUM PRIORITY)

**Current State:** Basic dialog component
**Enhancement:** Cinematic modal entrance with backdrop blur

**GSAP Features:**
- Timeline animations
- Scale/fade transitions
- Backdrop blur timing

**Implementation Location:**
- `src/components/casestudies/CaseStudyModal.jsx`

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function CaseStudyModal({ isOpen, onClose, caseStudy }) {
  const modalRef = useRef();
  const backdropRef = useRef();
  const { contextSafe } = useGSAP({ scope: modalRef });

  useEffect(() => {
    if (isOpen) {
      openModal();
    }
  }, [isOpen]);

  const openModal = contextSafe(() => {
    const tl = gsap.timeline();

    tl.to(backdropRef.current, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    .fromTo(modalRef.current,
      { opacity: 0, scale: 0.8, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
      '-=0.15'
    );
  });

  const closeModal = contextSafe(() => {
    const tl = gsap.timeline({
      onComplete: () => onClose()
    });

    tl.to(modalRef.current, {
      opacity: 0,
      scale: 0.9,
      y: 20,
      duration: 0.3,
      ease: 'power2.in'
    })
    .to(backdropRef.current, {
      opacity: 0,
      duration: 0.2
    }, '-=0.1');
  });

  return (
    <>
      <div ref={backdropRef} onClick={closeModal} className="backdrop" />
      <div ref={modalRef} className="modal">
        {/* Modal content */}
      </div>
    </>
  );
}
```

**Battery Impact:** LOW (short animations)
**Estimated Implementation Time:** 3-4 hours

---

### 6. Service List Stagger Animation (🟡 MEDIUM PRIORITY)

**Current State:** Static list of service cards
**Enhancement:** Staggered fade-in with parallax on scroll

**GSAP Features:**
- Stagger animations
- ScrollTrigger
- Parallax effects (optional)

**Implementation Location:**
- `src/pages/Capabilities.jsx`

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function CapabilitiesPage() {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.fromTo('.service-card',
      {
        opacity: 0,
        y: 60,
        scale: 0.95
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 0.8, // Total stagger time
          from: 'start', // Or 'center', 'edges', 'random'
          ease: 'power2.out'
        },
        scrollTrigger: {
          trigger: '.service-grid',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef}>
      <div className="service-grid">
        {services.map(service => (
          <div key={service.id} className="service-card">
            {/* Card content */}
          </div>
        ))}
      </div>
    </div>
  );
}
```

**Battery Impact:** LOW
**Estimated Implementation Time:** 2-3 hours

**Real-World Examples:**
- Advanced Staggers: https://codepen.io/GreenSock/pen/jdawKx
- Grid Animations: https://codepen.io/GreenSock/pen/MWpoPJg

---

### 7. Blueprint Timeline Animation (🟡 MEDIUM PRIORITY)

**Current State:** Static implementation roadmap
**Enhancement:** Animated timeline with progressive reveal

**GSAP Features:**
- DrawSVG (optional paid plugin - or use CSS stroke-dasharray)
- Timeline sequencing
- ScrollTrigger

**Implementation Location:**
- `src/pages/Blueprint.jsx`

**Code Example (without paid plugin):**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function BlueprintTimeline() {
  const timelineRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: 'top 70%',
        end: 'bottom 20%',
        scrub: 1, // Smooth scrubbing
        pin: false
      }
    });

    // Animate timeline line
    tl.fromTo('.timeline-line',
      { scaleY: 0, transformOrigin: 'top' },
      { scaleY: 1, duration: 2 }
    )
    // Stagger in timeline items
    .fromTo('.timeline-item',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, stagger: 0.3, duration: 0.8 },
      '-=1.5'
    );
  }, { scope: timelineRef });

  return (
    <div ref={timelineRef}>
      <div className="timeline-line" />
      {milestones.map(milestone => (
        <div key={milestone.id} className="timeline-item">
          {/* Milestone content */}
        </div>
      ))}
    </div>
  );
}
```

**Battery Impact:** LOW-MEDIUM (scroll-based)
**Estimated Implementation Time:** 5-7 hours

---

### 8. Touch Swipe Navigation (🔴 HIGH PRIORITY)

**Current State:** Click navigation via buttons
**Enhancement:** Touch swipe gestures between slides

**GSAP Features:**
- Draggable plugin
- Snap functionality
- Momentum/inertia

**Alternative:** Can use @use-gesture/react instead

**Implementation Location:**
- `src/pages/Layout.jsx`

**Code Example (using @use-gesture):**
```jsx
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';
import { useNavigate } from 'react-router-dom';

function SwipeableLayout({ children, currentPage }) {
  const navigate = useNavigate();
  const pages = ['Home', 'Dashboard', 'Introduction', 'Diagnostic', 'CaseStudies'];
  const currentIndex = pages.indexOf(currentPage);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], cancel, velocity: [vx] }) => {
      // Swipe left (next page)
      if (mx < -100 && xDir < 0 && currentIndex < pages.length - 1) {
        cancel();
        navigate(`/${pages[currentIndex + 1]}`);
      }
      // Swipe right (previous page)
      else if (mx > 100 && xDir > 0 && currentIndex > 0) {
        cancel();
        navigate(`/${pages[currentIndex - 1]}`);
      }
      // Update position during drag
      else {
        api.start({ x: mx, immediate: true });
      }
    },
    onDragEnd: () => {
      // Snap back to center
      api.start({ x: 0 });
    }
  }, {
    drag: {
      axis: 'x',
      bounds: { left: -200, right: 200 },
      rubberband: true
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        touchAction: 'pan-y' // Allow vertical scrolling, handle horizontal swipes
      }}
    >
      {children}
    </animated.div>
  );
}
```

**Battery Impact:** LOW (native touch events)
**Estimated Implementation Time:** 6-8 hours

---

### 9. ScrollTrigger Parallax Effects (🟢 LOW PRIORITY - Polish)

**Current State:** Standard scroll
**Enhancement:** Subtle parallax on background elements

**GSAP Features:**
- ScrollTrigger with scrub
- Background parallax

**Implementation Location:**
- Various pages with hero sections

**Code Example:**
```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function ParallaxSection() {
  const bgRef = useRef();

  useGSAP(() => {
    gsap.to(bgRef.current, {
      y: 100,
      ease: 'none',
      scrollTrigger: {
        trigger: bgRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  });

  return (
    <div className="relative overflow-hidden">
      <div ref={bgRef} className="absolute inset-0 bg-image" />
      <div className="relative z-10">{/* Content */}</div>
    </div>
  );
}
```

**Battery Impact:** LOW-MEDIUM (continuous scroll updates)
**Estimated Implementation Time:** 2-4 hours per page

**Note:** Use sparingly for battery efficiency

---

## Three.js Enhancement Plan

### Priority Matrix

| Feature | Priority | Complexity | Impact | Battery Cost |
|---------|----------|------------|--------|--------------|
| 3D Case Study Metrics | 🔴 HIGH | HIGH | HIGH | MEDIUM |
| Particle Background | 🟡 MEDIUM | MEDIUM | MEDIUM | MEDIUM |
| 3D Logo Intro | 🟡 MEDIUM | MEDIUM | HIGH | LOW |
| Interactive 3D Product | 🟢 LOW | HIGH | MEDIUM | HIGH |
| 3D Competitive Matrix | 🟡 MEDIUM | HIGH | HIGH | MEDIUM |
| Animated 3D Icons | 🟢 LOW | MEDIUM | LOW | MEDIUM |

---

### 1. 3D Case Study Metrics Visualization (🔴 HIGHEST PRIORITY)

**Current State:** 2D charts using Recharts
**Enhancement:** Interactive 3D bar charts and graphs for case study results

**Three.js Features:**
- BoxGeometry for 3D bars
- OrbitControls for touch interaction
- InstancedMesh for performance
- Custom shaders for visual effects

**Implementation Location:**
- `src/pages/CaseStudies.jsx`
- New component: `src/components/casestudies/Chart3D.jsx`

**Battery Optimization:**
- Use low-poly geometries
- Implement LOD (Level of Detail)
- Limit to 60 objects max
- Disable shadows
- Use BasicMaterial instead of PhysicalMaterial

**Code Example:**
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef, useMemo } from 'react';

function Bar3D({ position, height, color, label }) {
  const meshRef = useRef();

  return (
    <group position={position}>
      <mesh ref={meshRef} castShadow={false}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function Chart3D({ data }) {
  const maxValue = useMemo(() => Math.max(...data.map(d => d.value)), [data]);

  return (
    <div className="h-96 w-full">
      <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />

        {data.map((item, i) => (
          <Bar3D
            key={item.label}
            position={[i * 1.5 - (data.length * 0.75), 0, 0]}
            height={(item.value / maxValue) * 5}
            color={item.color}
            label={`${item.value}%`}
          />
        ))}

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
          touches={{
            ONE: 1, // Single finger rotate
            TWO: 2  // Two finger pan/zoom
          }}
        />
      </Canvas>
    </div>
  );
}
```

**Battery Impact:** MEDIUM (limit animation updates)
**Estimated Implementation Time:** 10-15 hours

**Real-World Examples:**
- 3D Charts Tutorial: https://medium.com/cortico/3d-data-visualization-with-react-and-three-js-7272fb6de432
- R3F Data Viz: https://codesandbox.io/examples/package/@react-three/fiber

**Optimization Tips:**
1. Use `frameloop="demand"` on Canvas to only render when needed
2. Implement manual frame invalidation
3. Use InstancedMesh for repeated geometries
4. Limit polygon count to <10K total
5. Monitor performance with r3f-perf

---

### 2. Particle Background Effect (🟡 MEDIUM PRIORITY)

**Current State:** Solid color or gradient backgrounds
**Enhancement:** Subtle animated particle field for hero sections

**Three.js Features:**
- BufferGeometry with Points
- Custom vertex shader
- GPU-accelerated particle movement

**Implementation Location:**
- `src/pages/Home.jsx`
- New component: `src/components/effects/ParticleBackground.jsx`

**Battery Optimization:**
- Limit to 500-1000 particles (not 10,000+)
- Use GPU shaders for movement (not CPU)
- Reduce animation when battery < 20%
- Pause when not visible

**Code Example:**
```jsx
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

function Particles({ count = 500 }) {
  const points = useRef();

  // Generate particle positions
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }

    return positions;
  }, [count]);

  // Animate particles
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    points.current.rotation.y = time * 0.05;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#4A90E2"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function ParticleBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Particles count={500} />
      </Canvas>
    </div>
  );
}

export default ParticleBackground;
```

**Battery Impact:** MEDIUM (continuous rendering)
**Estimated Implementation Time:** 4-6 hours

**Optimization with Battery Detection:**
```jsx
// Add battery detection
function ParticleBackground() {
  const [particleCount, setParticleCount] = useState(500);

  useEffect(() => {
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        battery.addEventListener('levelchange', () => {
          if (battery.level < 0.2) {
            setParticleCount(100); // Reduce particles when low battery
          } else {
            setParticleCount(500);
          }
        });
      });
    }
  }, []);

  return (
    <Canvas frameloop="demand"> {/* Only render when needed */}
      <Particles count={particleCount} />
    </Canvas>
  );
}
```

**Real-World Examples:**
- Interactive Particles: https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
- GPGPU Particles: https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/

---

### 3. 3D Logo Intro Animation (🟡 MEDIUM PRIORITY)

**Current State:** Static 2D logo
**Enhancement:** 3D logo assembly/morphing animation on first load

**Three.js Features:**
- GLTFLoader for 3D models
- Animation mixer
- MeshStandardMaterial with PBR

**Implementation Location:**
- `src/pages/Home.jsx` or `src/components/branding/ClientLogo.tsx`

**Workflow:**
1. Export client logo as 3D model (Blender/Cinema 4D)
2. Load GLB/GLTF file
3. Play entrance animation
4. Transition to 2D logo

**Code Example:**
```jsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Logo3D({ onComplete }) {
  const group = useRef();
  const { scene, animations } = useGLTF('/models/logo.glb');
  const [mixer] = useState(() => new THREE.AnimationMixer(scene));

  useEffect(() => {
    if (animations.length) {
      const action = mixer.clipAction(animations[0]);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();

      // Trigger callback when animation completes
      mixer.addEventListener('finished', () => {
        setTimeout(onComplete, 500);
      });
    }
  }, [animations, mixer, onComplete]);

  useFrame((state, delta) => {
    mixer.update(delta);
  });

  return <primitive ref={group} object={scene} />;
}

function LogoIntro({ onComplete }) {
  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <Logo3D onComplete={onComplete} />
      </Canvas>
    </div>
  );
}
```

**Battery Impact:** LOW (one-time animation)
**Estimated Implementation Time:** 8-12 hours (including 3D modeling)

**Alternative (No 3D model):**
Use Three.js primitives to create geometric logo:
```jsx
function GeometricLogo() {
  const groupRef = useRef();

  useFrame((state) => {
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-1, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>
      <mesh position={[1, 0, 0]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#E24A90" />
      </mesh>
    </group>
  );
}
```

---

### 4. 3D Competitive Analysis Matrix (🟡 MEDIUM PRIORITY)

**Current State:** 2D competitor cards
**Enhancement:** Interactive 3D scatter plot for competitor positioning

**Three.js Features:**
- SphereGeometry for competitor nodes
- HTML annotations via drei <Html>
- Interactive hover states

**Implementation Location:**
- `src/pages/Diagnostic.jsx`
- New component: `src/components/diagnostic/CompetitorMatrix3D.jsx`

**Code Example:**
```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Text } from '@react-three/drei';
import { useState } from 'react';

function CompetitorNode({ position, competitor, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={position}>
      <mesh
        onClick={() => onClick(competitor)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={hovered ? '#4A90E2' : '#666'}
          emissive={hovered ? '#4A90E2' : '#000'}
          emissiveIntensity={hovered ? 0.5 : 0}
        />
      </mesh>

      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white px-3 py-2 rounded text-sm">
            {competitor.name}
          </div>
        </Html>
      )}
    </group>
  );
}

function CompetitorMatrix3D({ competitors }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="h-screen w-full">
      <Canvas camera={{ position: [0, 0, 10] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Axes */}
        <axesHelper args={[5]} />

        {/* X-axis label (Innovation) */}
        <Text position={[6, 0, 0]} fontSize={0.3} color="white">
          Innovation →
        </Text>

        {/* Y-axis label (Market Share) */}
        <Text position={[0, 6, 0]} fontSize={0.3} color="white">
          Market Share →
        </Text>

        {/* Competitor nodes */}
        {competitors.map(competitor => (
          <CompetitorNode
            key={competitor.id}
            position={[
              competitor.innovation * 5 - 2.5,
              competitor.marketShare * 5 - 2.5,
              0
            ]}
            competitor={competitor}
            onClick={setSelected}
          />
        ))}

        <OrbitControls
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>

      {/* Selected competitor details */}
      {selected && (
        <div className="absolute bottom-10 left-10 bg-black/90 text-white p-6 rounded">
          <h3 className="text-xl font-bold">{selected.name}</h3>
          <p className="mt-2">{selected.description}</p>
          <button
            onClick={() => setSelected(null)}
            className="mt-4 px-4 py-2 bg-blue-600 rounded"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
```

**Battery Impact:** MEDIUM (interactive scene)
**Estimated Implementation Time:** 12-16 hours

**Optimization:**
- Use frameloop="demand" and invalidate on interaction
- Limit to 20 competitor nodes max
- Use instancing for identical geometries

---

### 5. Integration with Existing Recharts (Hybrid Approach)

**Strategy:** Don't replace all Recharts - augment specific high-impact visualizations

**Hybrid Pattern:**
```jsx
import { useMediaQuery } from '@/hooks/use-mobile';
import { Suspense, lazy } from 'react';

const Chart3D = lazy(() => import('@/components/Chart3D'));

function MetricsVisualization({ data }) {
  const isTouchDevice = useMediaQuery('(pointer: coarse)');
  const [use3D, setUse3D] = useState(isTouchDevice);

  return (
    <div>
      <div className="mb-4 flex gap-2">
        <button onClick={() => setUse3D(false)}>2D View</button>
        <button onClick={() => setUse3D(true)}>3D View</button>
      </div>

      {use3D ? (
        <Suspense fallback={<div>Loading 3D view...</div>}>
          <Chart3D data={data} />
        </Suspense>
      ) : (
        <RechartsBarChart data={data} />
      )}
    </div>
  );
}
```

**Benefits:**
- Users can choose based on preference
- Fallback to 2D preserves battery
- Progressive enhancement

---

## Touch Gesture Optimization

### Current Touch Support Analysis

**Existing Libraries:**
- ✅ Framer Motion (installed) - Has drag support
- ❌ No dedicated gesture library

**Required Enhancements:**
1. Swipe navigation between slides
2. Pinch-to-zoom on charts/images
3. Long-press context menus
4. Pull-to-refresh (optional)
5. Drag-to-reorder (admin interface)

---

### Implementation with @use-gesture/react

**Installation:**
```bash
npm install @use-gesture/react
```

**1. Swipe Navigation (Highest Priority)**

Implemented in Layout.jsx:

```jsx
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@/node_modules/react-spring';
import { useNavigate, useLocation } from 'react-router-dom';

function SwipeableLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    '/Home',
    '/Dashboard',
    '/Introduction',
    '/Diagnostic',
    '/CaseStudies',
    '/Capabilities',
    '/Blueprint',
    '/Pricing',
    '/CallToAction'
  ];

  const currentIndex = pages.indexOf(location.pathname);

  const [{ x }, api] = useSpring(() => ({ x: 0 }));

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], velocity: [vx], cancel }) => {
      // Velocity-based threshold
      const threshold = vx > 0.5 ? 50 : 150;

      // Next slide (swipe left)
      if (mx < -threshold && xDir < 0 && currentIndex < pages.length - 1) {
        cancel();
        api.start({ x: -window.innerWidth, immediate: false });
        setTimeout(() => {
          navigate(pages[currentIndex + 1]);
          api.set({ x: 0 });
        }, 300);
      }
      // Previous slide (swipe right)
      else if (mx > threshold && xDir > 0 && currentIndex > 0) {
        cancel();
        api.start({ x: window.innerWidth, immediate: false });
        setTimeout(() => {
          navigate(pages[currentIndex - 1]);
          api.set({ x: 0 });
        }, 300);
      }
      // Update position during drag
      else {
        api.start({ x: mx, immediate: true });
      }
    },
    onDragEnd: ({ movement: [mx] }) => {
      // Snap back if threshold not met
      if (Math.abs(mx) < 150) {
        api.start({ x: 0 });
      }
    }
  }, {
    drag: {
      axis: 'x',
      bounds: { left: -300, right: 300 },
      rubberband: 0.15,
      filterTaps: true
    }
  });

  return (
    <animated.div
      {...bind()}
      style={{
        x,
        touchAction: 'pan-y', // Allow vertical scroll
        userSelect: 'none'
      }}
      className="h-full w-full"
    >
      {children}
    </animated.div>
  );
}
```

**2. Pinch-to-Zoom on Images**

```jsx
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@/node_modules/react-spring';

function ZoomableImage({ src, alt }) {
  const [{ scale }, api] = useSpring(() => ({ scale: 1 }));

  const bind = useGesture({
    onPinch: ({ offset: [s], cancel }) => {
      api.start({ scale: Math.max(1, Math.min(s, 3)) });
    },
    onPinchEnd: () => {
      // Reset to 1x on release if less than 1.2x
      if (scale.get() < 1.2) {
        api.start({ scale: 1 });
      }
    }
  }, {
    pinch: {
      scaleBounds: { min: 1, max: 3 },
      rubberband: true
    }
  });

  return (
    <animated.img
      {...bind()}
      src={src}
      alt={alt}
      style={{
        scale,
        touchAction: 'none'
      }}
      className="max-w-full"
    />
  );
}
```

**3. Long-Press Context Menu**

```jsx
import { useGesture } from '@use-gesture/react';
import { useState } from 'react';

function LongPressCard({ children, onContextMenu }) {
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

  const bind = useGesture({
    onPress: ({ xy: [x, y], cancel }) => {
      setMenuPos({ x, y });
      setShowMenu(true);
    }
  }, {
    press: {
      threshold: 500, // 500ms hold
      filterTaps: true
    }
  });

  return (
    <>
      <div {...bind()} style={{ touchAction: 'none' }}>
        {children}
      </div>

      {showMenu && (
        <div
          className="fixed bg-black/90 text-white rounded shadow-lg p-2"
          style={{
            left: menuPos.x,
            top: menuPos.y,
            zIndex: 50
          }}
        >
          <button onClick={() => { onContextMenu('edit'); setShowMenu(false); }}>
            Edit
          </button>
          <button onClick={() => { onContextMenu('delete'); setShowMenu(false); }}>
            Delete
          </button>
          <button onClick={() => setShowMenu(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}
```

**4. Drag-to-Reorder (Admin)**

```jsx
import { useGesture } from '@use-gesture/react';
import { useSprings, animated } from '@/node_modules/react-spring';
import { useState } from 'react';

function DraggableList({ items, onReorder }) {
  const [order, setOrder] = useState(items.map((_, i) => i));

  const springs = useSprings(
    items.length,
    order.map((orderIndex) => ({ y: orderIndex * 80 }))
  );

  const bind = useGesture({
    onDrag: ({ args: [index], movement: [, my], down }) => {
      const curIndex = order.indexOf(index);
      const curRow = Math.round((curIndex * 80 + my) / 80);
      const newOrder = move(order, curIndex, curRow);

      if (!down) {
        onReorder(newOrder.map(i => items[i]));
      }

      setOrder(down ? newOrder : order);
    }
  });

  return (
    <div className="relative h-full">
      {springs.map(({ y }, i) => (
        <animated.div
          {...bind(order[i])}
          key={items[order[i]].id}
          style={{
            y,
            position: 'absolute',
            width: '100%',
            touchAction: 'none'
          }}
        >
          {items[order[i]].content}
        </animated.div>
      ))}
    </div>
  );
}

function move(arr, from, to) {
  const newArr = [...arr];
  const item = newArr.splice(from, 1)[0];
  newArr.splice(to, 0, item);
  return newArr;
}
```

---

### Touch Target Optimization

**Minimum Tap Target Sizes (WCAG 2.5.5):**
- Standard: 44x44px (minimum)
- Recommended: 56x56px
- Ideal for 27": 64x64px

**Audit Current Components:**

```bash
# Search for buttons/interactive elements
grep -r "className.*button\|onClick" src/components --include="*.jsx"
```

**Button Enhancement:**

Update `src/components/ui/button.jsx`:

```jsx
const buttonVariants = cva(
  "inline-flex items-center justify-center...",
  {
    variants: {
      size: {
        default: "h-14 px-6 py-4", // Increased from h-10
        sm: "h-12 px-5", // Increased from h-9
        lg: "h-16 px-8", // Increased from h-11
        icon: "h-14 w-14", // Increased from h-10 w-10
        touch: "h-16 w-16 text-2xl" // New touch-optimized size
      }
    }
  }
);
```

**Touch Feedback (Ripple Effect):**

Create `src/components/ui/touch-ripple.jsx`:

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TouchRipple({ children, className, ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleTouch = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    const ripple = {
      x,
      y,
      id: Date.now()
    };

    setRipples(prev => [...prev, ripple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouch}
      {...props}
    >
      {children}

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full bg-white/30"
            style={{
              left: ripple.x,
              top: ripple.y
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0 }}
            animate={{
              width: 200,
              height: 200,
              x: -100,
              y: -100,
              opacity: [1, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

**Usage:**
```jsx
import { TouchRipple } from '@/components/ui/touch-ripple';

<TouchRipple className="p-4 bg-blue-600 rounded">
  <button>Click Me</button>
</TouchRipple>
```

---

## Performance & Battery Optimization

### Battery Monitoring System

Create `src/lib/battery-manager.ts`:

```typescript
type BatteryLevel = 'high' | 'medium' | 'low' | 'critical';
type PerformanceMode = 'high' | 'balanced' | 'saver';

interface BatteryManager {
  level: number;
  charging: boolean;
  mode: PerformanceMode;
}

class DeviceBatteryManager {
  private static instance: DeviceBatteryManager;
  private battery: any = null;
  private listeners: Set<(battery: BatteryManager) => void> = new Set();

  private constructor() {
    this.initialize();
  }

  static getInstance(): DeviceBatteryManager {
    if (!this.instance) {
      this.instance = new DeviceBatteryManager();
    }
    return this.instance;
  }

  private async initialize() {
    if ('getBattery' in navigator) {
      try {
        this.battery = await (navigator as any).getBattery();

        this.battery.addEventListener('levelchange', () => this.notify());
        this.battery.addEventListener('chargingchange', () => this.notify());
      } catch (error) {
        console.warn('Battery API not supported');
      }
    }
  }

  private notify() {
    const status = this.getStatus();
    this.listeners.forEach(listener => listener(status));
  }

  getStatus(): BatteryManager {
    if (!this.battery) {
      return { level: 1, charging: true, mode: 'high' };
    }

    const level = this.battery.level;
    const charging = this.battery.charging;

    let mode: PerformanceMode = 'high';

    if (!charging) {
      if (level < 0.1) mode = 'saver'; // Critical
      else if (level < 0.2) mode = 'saver'; // Low
      else if (level < 0.5) mode = 'balanced'; // Medium
    }

    return { level, charging, mode };
  }

  subscribe(callback: (battery: BatteryManager) => void) {
    this.listeners.add(callback);
    callback(this.getStatus()); // Immediate call

    return () => {
      this.listeners.delete(callback);
    };
  }
}

export const batteryManager = DeviceBatteryManager.getInstance();
```

**React Hook:**

Create `src/hooks/use-battery.ts`:

```typescript
import { useState, useEffect } from 'react';
import { batteryManager } from '@/lib/battery-manager';

export function useBattery() {
  const [battery, setBattery] = useState(batteryManager.getStatus());

  useEffect(() => {
    const unsubscribe = batteryManager.subscribe(setBattery);
    return unsubscribe;
  }, []);

  return battery;
}
```

**Usage in Components:**

```jsx
import { useBattery } from '@/hooks/use-battery';

function ParticleBackground() {
  const { mode } = useBattery();

  const particleCount = {
    high: 1000,
    balanced: 500,
    saver: 100
  }[mode];

  return (
    <Canvas frameloop={mode === 'saver' ? 'never' : 'always'}>
      <Particles count={particleCount} />
    </Canvas>
  );
}
```

---

### GPU Acceleration Best Practices

**CSS Properties to Use (Battery Efficient):**
- ✅ `transform` (translate, scale, rotate)
- ✅ `opacity`
- ✅ `filter` (use sparingly)

**CSS Properties to AVOID (CPU-heavy):**
- ❌ `left`, `top`, `right`, `bottom`
- ❌ `width`, `height` (during animation)
- ❌ `margin`, `padding` (during animation)
- ❌ `box-shadow` (during animation)

**Force GPU Acceleration:**

```css
/* Add to animated elements */
.gpu-accelerated {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
  backface-visibility: hidden;
}
```

**IMPORTANT:** Remove `will-change` after animation completes:

```jsx
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

function AnimatedCard() {
  const cardRef = useRef();

  useGSAP(() => {
    gsap.to(cardRef.current, {
      x: 100,
      duration: 1,
      onStart: () => {
        cardRef.current.style.willChange = 'transform';
      },
      onComplete: () => {
        cardRef.current.style.willChange = 'auto'; // Remove to save power
      }
    });
  });

  return <div ref={cardRef}>Card Content</div>;
}
```

---

### GSAP Performance Optimization

**1. Use `invalidateOnRefresh: false` for static content:**

```jsx
useGSAP(() => {
  gsap.to('.static-element', {
    x: 100,
    duration: 1,
    invalidateOnRefresh: false
  });
});
```

**2. Reduce animation updates with `autoAlpha` instead of `opacity`:**

```jsx
// Instead of:
gsap.to('.element', { opacity: 0 });

// Use (also sets visibility):
gsap.to('.element', { autoAlpha: 0 });
```

**3. Use `overwrite: 'auto'` to prevent conflicts:**

```jsx
gsap.to('.element', {
  x: 100,
  overwrite: 'auto' // Kills conflicting animations
});
```

**4. Lazy register plugins:**

```jsx
// Don't register all plugins upfront
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// gsap.registerPlugin(ScrollTrigger); // ❌ Loads immediately

// Instead, register on-demand:
const ScrollTriggerPlugin = lazy(() =>
  import('gsap/ScrollTrigger').then(module => {
    gsap.registerPlugin(module.ScrollTrigger);
    return module;
  })
);
```

---

### Three.js Performance Optimization

**1. Use `frameloop="demand"` for static scenes:**

```jsx
<Canvas frameloop="demand">
  <StaticScene />
</Canvas>

// Trigger frame manually:
import { useThree } from '@react-three/fiber';

function StaticScene() {
  const { invalidate } = useThree();

  const handleInteraction = () => {
    // Render one frame
    invalidate();
  };

  return <mesh onClick={handleInteraction}>...</mesh>;
}
```

**2. Use InstancedMesh for repeated geometries:**

```jsx
import { useRef } from 'react';
import * as THREE from 'three';

function InstancedBoxes({ count = 100 }) {
  const meshRef = useRef();

  useEffect(() => {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      dummy.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshBasicMaterial color="blue" />
    </instancedMesh>
  );
}
```

**3. Use LOD (Level of Detail):**

```jsx
import { Detailed } from '@react-three/drei';

function AdaptiveModel() {
  return (
    <Detailed distances={[0, 10, 20]}>
      <HighPolyModel /> {/* Shown when close */}
      <MediumPolyModel /> {/* Shown at medium distance */}
      <LowPolyModel /> {/* Shown when far */}
    </Detailed>
  );
}
```

**4. Disable shadows (expensive):**

```jsx
// ❌ Shadows are expensive
<Canvas shadows>
  <directionalLight castShadow />
  <mesh receiveShadow castShadow />
</Canvas>

// ✅ Use baked lighting or ambient occlusion textures instead
<Canvas>
  <ambientLight intensity={0.6} />
  <directionalLight intensity={0.8} />
</Canvas>
```

**5. Use BasicMaterial instead of StandardMaterial:**

```jsx
// ❌ Expensive physically-based rendering
<meshStandardMaterial color="blue" metalness={0.5} roughness={0.5} />

// ✅ Cheap, no lighting calculations
<meshBasicMaterial color="blue" />

// ⚖️ Middle ground (Phong shading)
<meshLambertMaterial color="blue" />
```

**6. Limit polygon count:**

```jsx
// ❌ High-poly sphere (3,072 polygons)
<sphereGeometry args={[1, 64, 64]} />

// ✅ Low-poly sphere (192 polygons, looks fine at distance)
<sphereGeometry args={[1, 16, 16]} />
```

**7. Monitor performance with r3f-perf:**

```bash
npm install --save-dev r3f-perf
```

```jsx
import { Perf } from 'r3f-perf';

function Scene() {
  return (
    <Canvas>
      {process.env.NODE_ENV === 'development' && <Perf position="top-left" />}
      {/* Your scene */}
    </Canvas>
  );
}
```

---

### Service Worker for Offline Presentations

**Strategy:** Cache-first for assets, network-first for data

Create `public/sw.js`:

```javascript
const CACHE_VERSION = 'ai-presenter-v1';
const ASSETS_CACHE = `${CACHE_VERSION}-assets`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/index.css',
  // Add critical assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(ASSETS_CACHE).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('ai-presenter-') && name !== ASSETS_CACHE && name !== DATA_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API requests: Network first, cache fallback
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clonedResponse = response.clone();
          caches.open(DATA_CACHE).then((cache) => {
            cache.put(request, clonedResponse);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
  // Assets: Cache first
  else {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request).then((fetchResponse) => {
          return caches.open(ASSETS_CACHE).then((cache) => {
            cache.put(request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

**Register in `src/main.jsx`:**

```jsx
// Register service worker
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered:', registration);
      })
      .catch(error => {
        console.log('SW registration failed:', error);
      });
  });
}
```

---

## webOS Compatibility Considerations

### Browser Limitations (Chrome 68 - September 2018)

**Supported ES Features:**
- ✅ ES2018 (async iteration, rest/spread)
- ✅ ES2017 (async/await)
- ✅ ES2015 (ES6 - classes, arrow functions, let/const)

**NOT Supported (requires transpilation):**
- ❌ ES2019+ (flatMap, Object.fromEntries)
- ❌ ES2020+ (optional chaining `?.`, nullish coalescing `??`)
- ❌ ES2021+ (logical assignment `||=`)

**Vite Config Update:**

Update `vite.config.js`:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'chrome68', // Match webOS browser
    cssTarget: 'chrome68',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        passes: 2
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'chrome68'
    }
  }
});
```

---

### WebGL Detection & Fallback

Create `src/lib/webgl-detector.ts`:

```typescript
export function detectWebGL(): {
  supported: boolean;
  version: number;
  renderer: string;
} {
  try {
    const canvas = document.createElement('canvas');

    // Try WebGL 2
    let gl = canvas.getContext('webgl2');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        supported: true,
        version: 2,
        renderer: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'Unknown'
      };
    }

    // Fallback to WebGL 1
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      return {
        supported: true,
        version: 1,
        renderer: debugInfo
          ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
          : 'Unknown'
      };
    }

    return { supported: false, version: 0, renderer: 'None' };
  } catch (e) {
    return { supported: false, version: 0, renderer: 'Error' };
  }
}
```

**Usage:**

```jsx
import { detectWebGL } from '@/lib/webgl-detector';
import { lazy, Suspense } from 'react';

const Chart3D = lazy(() => import('@/components/Chart3D'));
const ChartFallback = lazy(() => import('@/components/ChartFallback'));

function DataVisualization({ data }) {
  const webgl = detectWebGL();

  if (!webgl.supported) {
    return <ChartFallback data={data} />;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Chart3D data={data} />
    </Suspense>
  );
}
```

---

### Orientation Change Detection

Create `src/hooks/use-orientation.ts`:

```typescript
import { useState, useEffect } from 'react';

export type Orientation = 'portrait' | 'landscape';

export function useOrientation(): Orientation {
  const [orientation, setOrientation] = useState<Orientation>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
      );
    };

    // Listen to window resize (more reliable than orientationchange)
    window.addEventListener('resize', handleOrientationChange);

    // Also listen to orientation change event
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}
```

**Usage:**

```jsx
import { useOrientation } from '@/hooks/use-orientation';

function ResponsiveLayout() {
  const orientation = useOrientation();

  return (
    <div className={orientation === 'portrait' ? 'flex-col' : 'flex-row'}>
      {/* Layout adapts to orientation */}
    </div>
  );
}
```

**CSS Media Queries:**

```css
/* Portrait mode (screen flat or vertical) */
@media (orientation: portrait) {
  .hero-text {
    font-size: 3rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

/* Landscape mode (normal viewing) */
@media (orientation: landscape) {
  .hero-text {
    font-size: 4rem;
  }

  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

### High Contrast Mode for Outdoor Use

Create `src/components/ui/contrast-mode-toggle.tsx`:

```tsx
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from './button';

export function ContrastModeToggle() {
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setHighContrast(!highContrast)}
      title={highContrast ? 'Normal Mode' : 'High Contrast Mode'}
    >
      {highContrast ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
}
```

**CSS (add to `src/index.css`):**

```css
/* High contrast mode for outdoor visibility */
.high-contrast {
  --background: 0 0% 100%;
  --foreground: 0 0% 0%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 0%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 0%;
  --primary: 220 100% 25%; /* Dark blue */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 10%;
  --secondary-foreground: 0 0% 100%;
  --muted: 0 0% 90%;
  --muted-foreground: 0 0% 10%;
  --accent: 0 0% 10%;
  --accent-foreground: 0 0% 100%;
  --border: 0 0% 20%;
  --input: 0 0% 20%;
  --ring: 220 100% 25%;
}

.high-contrast * {
  font-weight: 600 !important; /* Bolder text */
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.5) !important; /* Subtle shadow */
}

.high-contrast .shadow-lg {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8) !important;
}

/* Increase contrast for all text */
.high-contrast p,
.high-contrast h1,
.high-contrast h2,
.high-contrast h3,
.high-contrast h4,
.high-contrast h5,
.high-contrast h6 {
  color: #000 !important;
}
```

**WCAG AAA Contrast Checker:**

```typescript
export function checkContrast(fg: string, bg: string): {
  ratio: number;
  wcagAAA: boolean;
  wcagAA: boolean;
} {
  const rgb1 = hexToRgb(fg);
  const rgb2 = hexToRgb(bg);

  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);

  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  return {
    ratio: Math.round(ratio * 100) / 100,
    wcagAAA: ratio >= 7, // 7:1 for normal text
    wcagAA: ratio >= 4.5 // 4.5:1 for normal text
  };
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
      ]
    : [0, 0, 0];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2) - PRIORITY

**Goal:** Set up core libraries and infrastructure

**Tasks:**
1. ✅ Install GSAP and @gsap/react
2. ✅ Install @use-gesture/react
3. ✅ Install @react-three/fiber and @react-three/drei
4. ✅ Configure Vite for Chrome 68 compatibility
5. ✅ Create battery manager system
6. ✅ Create WebGL detection utility
7. ✅ Create orientation detection hook
8. ✅ Set up service worker for offline mode
9. ✅ Add high contrast mode toggle
10. ✅ Update button sizes for touch targets

**Deliverables:**
- All dependencies installed
- Core utility hooks created
- Vite config optimized
- Battery and performance monitoring in place

**Estimated Time:** 10-15 hours

---

### Phase 2: Quick Wins - High Impact, Low Effort (Week 2-3)

**Goal:** Implement visible improvements that wow users

**Tasks:**
1. ✅ Slide page transitions (GSAP Timeline)
   - Location: `src/pages/Layout.jsx`
   - Time: 3-4 hours

2. ✅ Home page hero animation (GSAP Stagger)
   - Location: `src/pages/Home.jsx`
   - Time: 4-5 hours

3. ✅ Dashboard metric counter animation (GSAP + ScrollTrigger)
   - Location: `src/pages/Dashboard.jsx`
   - Time: 2-3 hours

4. ✅ Touch swipe navigation between slides (@use-gesture)
   - Location: `src/pages/Layout.jsx`
   - Time: 6-8 hours

5. ✅ Touch ripple feedback on all buttons
   - Location: `src/components/ui/touch-ripple.jsx`
   - Apply to: All interactive elements
   - Time: 3-4 hours

**Deliverables:**
- Smooth page transitions
- Animated hero section
- Counting numbers on dashboard
- Swipe navigation working
- Tactile touch feedback

**Estimated Time:** 18-24 hours

---

### Phase 3: 3D Visualizations (Week 4-5)

**Goal:** Add impressive 3D data visualizations

**Tasks:**
1. ✅ 3D case study metrics chart (Three.js + R3F)
   - Location: `src/components/casestudies/Chart3D.jsx`
   - Replace 2D Recharts with 3D option
   - Time: 12-15 hours

2. ✅ Particle background on hero pages (Three.js)
   - Location: `src/components/effects/ParticleBackground.jsx`
   - Apply to: Home, Introduction
   - Time: 5-6 hours

3. ✅ 3D competitive analysis matrix (Three.js + R3F)
   - Location: `src/components/diagnostic/CompetitorMatrix3D.jsx`
   - Interactive scatter plot
   - Time: 12-16 hours

**Deliverables:**
- Working 3D bar/line charts
- Subtle particle backgrounds
- Interactive 3D competitor visualization

**Estimated Time:** 29-37 hours

---

### Phase 4: Polish & Micro-interactions (Week 6)

**Goal:** Add delightful details and refinements

**Tasks:**
1. ✅ SWOT card flip animations (GSAP 3D transforms)
   - Location: `src/components/diagnostic/StrengthWeaknessGrid.jsx`
   - Time: 5-6 hours

2. ✅ Service list stagger reveal (GSAP ScrollTrigger)
   - Location: `src/pages/Capabilities.jsx`
   - Time: 2-3 hours

3. ✅ Case study modal entrance (GSAP Timeline)
   - Location: `src/components/casestudies/CaseStudyModal.jsx`
   - Time: 3-4 hours

4. ✅ Blueprint timeline animation (GSAP + ScrollTrigger)
   - Location: `src/pages/Blueprint.jsx`
   - Time: 6-7 hours

5. ✅ Pinch-to-zoom on images (@use-gesture)
   - Apply globally to case study images
   - Time: 3-4 hours

**Deliverables:**
- Polished micro-interactions throughout
- Smooth modal transitions
- Interactive image zoom
- Animated timeline

**Estimated Time:** 19-24 hours

---

### Phase 5: Optimization & Testing (Week 7)

**Goal:** Ensure excellent performance and battery life

**Tasks:**
1. ✅ Battery-aware animation reduction
   - Reduce particle counts
   - Disable 3D effects in saver mode
   - Time: 4-5 hours

2. ✅ Performance profiling with r3f-perf
   - Identify bottlenecks
   - Optimize heavy scenes
   - Time: 3-4 hours

3. ✅ Service worker testing
   - Verify offline functionality
   - Cache optimization
   - Time: 3-4 hours

4. ✅ Cross-orientation testing
   - Test in portrait/landscape/table mode
   - Fix layout issues
   - Time: 4-5 hours

5. ✅ Touch target audit
   - Ensure all buttons meet 44x44px minimum
   - Test with real fingers
   - Time: 3-4 hours

6. ✅ High contrast mode testing
   - Verify WCAG AAA compliance
   - Test in sunlight simulation
   - Time: 2-3 hours

**Deliverables:**
- Lighthouse score 90+
- 3+ hours battery life verified
- Offline mode working
- All touch targets accessible
- High contrast mode polished

**Estimated Time:** 19-25 hours

---

### Phase 6: Advanced Features (Optional - Week 8+)

**Goal:** Add premium features if time permits

**Tasks:**
1. ✅ 3D logo intro animation (Three.js + GLTF)
   - Requires 3D modeling
   - Time: 10-15 hours

2. ✅ Parallax scroll effects (GSAP ScrollTrigger)
   - Subtle background parallax
   - Time: 4-6 hours per page

3. ✅ Drag-to-reorder admin interface (@use-gesture)
   - Location: Admin pages
   - Time: 8-10 hours

4. ✅ Lottie animation integration
   - Loading animations
   - Branded motion graphics
   - Time: 5-7 hours

**Estimated Time:** 27-38 hours

---

## Total Implementation Estimate

| Phase | Time Estimate |
|-------|---------------|
| Phase 1: Foundation | 10-15 hours |
| Phase 2: Quick Wins | 18-24 hours |
| Phase 3: 3D Visualizations | 29-37 hours |
| Phase 4: Polish | 19-24 hours |
| Phase 5: Optimization | 19-25 hours |
| Phase 6: Advanced (Optional) | 27-38 hours |
| **TOTAL (Required)** | **95-125 hours** |
| **TOTAL (with Advanced)** | **122-163 hours** |

**Recommended Approach:** Implement Phases 1-5 first (95-125 hours / 2.5-3 weeks full-time), then evaluate ROI before proceeding to Phase 6.

---

## Code Examples & Quick Start

### Quick Start: Add First GSAP Animation

**Step 1: Install GSAP**

```bash
npm install gsap @gsap/react
```

**Step 2: Create Test Component**

Create `src/pages/TestAnimation.jsx`:

```jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

export default function TestAnimation() {
  const containerRef = useRef();

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1, yoyo: true });

    tl.to('.box', {
      x: 300,
      rotation: 360,
      duration: 2,
      ease: 'power2.inOut'
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="flex items-center justify-center h-screen bg-black">
      <div className="box w-24 h-24 bg-blue-500"></div>
    </div>
  );
}
```

**Step 3: Add Route**

Update `src/pages/index.jsx`:

```jsx
import TestAnimation from './TestAnimation';

// Add to routes
<Route path="/test-animation" element={<TestAnimation />} />
```

**Step 4: Test**

Navigate to `http://localhost:5173/test-animation`

You should see a blue box animating left/right with rotation!

---

### Quick Start: Add First Three.js Scene

**Step 1: Install Three.js**

```bash
npm install three @react-three/fiber @react-three/drei
```

**Step 2: Create Test Component**

Create `src/pages/Test3D.jsx`:

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

function RotatingBox() {
  return (
    <Box args={[1, 1, 1]} rotation={[0.5, 0.5, 0]}>
      <meshStandardMaterial color="hotpink" />
    </Box>
  );
}

export default function Test3D() {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} />
        <RotatingBox />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
```

**Step 3: Add Route**

```jsx
import Test3D from './Test3D';

<Route path="/test-3d" element={<Test3D />} />
```

**Step 4: Test**

Navigate to `http://localhost:5173/test-3d`

You should see a rotating pink cube that you can rotate with mouse/touch!

---

### Quick Start: Add Touch Swipe Detection

**Step 1: Install @use-gesture**

```bash
npm install @use-gesture/react
```

**Step 2: Create Test Component**

Create `src/pages/TestSwipe.jsx`:

```jsx
import { useGesture } from '@use-gesture/react';
import { useState } from 'react';

export default function TestSwipe() {
  const [swipeDirection, setSwipeDirection] = useState('');

  const bind = useGesture({
    onDrag: ({ direction: [xDir, yDir], distance }) => {
      if (distance > 50) {
        if (Math.abs(xDir) > Math.abs(yDir)) {
          setSwipeDirection(xDir > 0 ? 'Right' : 'Left');
        } else {
          setSwipeDirection(yDir > 0 ? 'Down' : 'Up');
        }
      }
    },
    onDragEnd: () => {
      setTimeout(() => setSwipeDirection(''), 1000);
    }
  });

  return (
    <div
      {...bind()}
      className="h-screen flex items-center justify-center bg-black text-white text-6xl"
      style={{ touchAction: 'none' }}
    >
      {swipeDirection ? `Swiped ${swipeDirection}` : 'Swipe me!'}
    </div>
  );
}
```

**Step 3: Add Route and Test**

Navigate to `http://localhost:5173/test-swipe`

Swipe on screen (or drag with mouse) to see direction detection!

---

## Resources & References

### Official Documentation

**GSAP:**
- Main Docs: https://gsap.com/docs/v3/
- React Integration: https://gsap.com/resources/React/
- ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- Draggable: https://gsap.com/docs/v3/Plugins/Draggable/
- Forum: https://gsap.com/community/

**Three.js & React Three Fiber:**
- Three.js Docs: https://threejs.org/docs/
- R3F Docs: https://docs.pmnd.rs/react-three-fiber
- Drei Helpers: https://github.com/pmndrs/drei
- R3F Examples: https://docs.pmnd.rs/react-three-fiber/getting-started/examples
- Performance Guide: https://r3f.docs.pmnd.rs/advanced/scaling-performance

**@use-gesture:**
- Official Docs: https://use-gesture.netlify.app/
- Examples: https://codesandbox.io/examples/package/@use-gesture/react

**webOS Development:**
- webOS TV Developer: https://webostv.developer.lge.com/
- Web API Reference: https://webostv.developer.lge.com/develop/specifications/web-api-and-web-engine

---

### Code Examples & Inspiration

**GSAP CodePen Collections:**
- ScrollTrigger Showcase: https://codepen.io/collection/DkvGzg
- Advanced Staggers: https://codepen.io/GreenSock/pen/jdawKx
- Timeline Basics: https://codepen.io/GreenSock/pen/GRrQKP
- Scroll Timeline: https://codepen.io/GreenSock/pen/PoBdOzX

**Three.js Examples:**
- 3D Data Viz Tutorial: https://medium.com/cortico/3d-data-visualization-with-react-and-three-js-7272fb6de432
- Interactive Particles: https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/
- GPGPU Particles: https://tympanus.net/codrops/2024/12/19/crafting-a-dreamy-particle-effect-with-three-js-and-gpgpu/
- R3F Contribution Chart: https://napjose.ph/posts/create-a-3d-contribution-chart-using-react-three-fiber

**Touch Gesture Examples:**
- use-gesture Demos: https://use-gesture.netlify.app/
- React Spring + Gestures: https://codesandbox.io/examples/package/react-use-gesture

---

### AI Tools & Generators

**GSAP Code Generators:**
- GSAPify: https://gsapify.com/gsap-animation-generator
- Workik AI: https://workik.com/javascript-animation-code-generator
- GSAP GPT: https://www.yeschat.ai/gpts-9t557atEdv9-GSAP-GPT
- GSAP Genius: https://plz.ai/tools/gsap-genius-v3--ZxX6UxqV

**Design Tools:**
- Lottie Files: https://lottiefiles.com/ (After Effects animations)
- Spline: https://spline.design/ (3D design in browser)
- Ready Player Me: https://readyplayer.me/ (3D avatars)

---

### Learning Resources

**GSAP Tutorials:**
- Getting Started: https://gsap.com/resources/get-started/
- ScrollTrigger Tutorial: https://gsap.com/resources/st-basics/
- React + GSAP: https://dev.to/dominikanizioek/react-three-fiber-advanced-concepts
- Codrops GSAP Tips: https://tympanus.net/codrops/2025/09/03/7-must-know-gsap-animation-tips-for-creative-developers/

**Three.js Tutorials:**
- Three.js Journey: https://threejs-journey.com/
- R3F Basics: https://tsh.io/blog/react-three-fiber/
- Building 60FPS WebGL: https://www.airtightinteractive.com/2015/01/building-a-60fps-webgl-game-on-mobile/
- Performance Optimization: https://tympanus.net/codrops/2025/02/11/building-efficient-three-js-scenes/

**Touch & Gestures:**
- Touch UX Best Practices: https://blog.openreplay.com/mastering-touch-and-gesture-interactions-in-react/
- Mobile Animation Optimization: https://blog.pixelfreestudio.com/how-to-optimize-motion-design-for-mobile-performance/

**Battery & Performance:**
- GPU Acceleration Guide: https://blog.teamtreehouse.com/increase-your-sites-performance-with-hardware-accelerated-css
- Service Workers: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
- Offline-First Apps: https://techtruth.dev/building-offline-first-web-applications-with-service-workers-and-indexeddb

---

### Accessibility & Standards

**WCAG Guidelines:**
- WebAIM Contrast Checker: https://webaim.org/articles/contrast/
- WCAG 2.1 Quick Reference: https://www.w3.org/WAI/WCAG21/quickref/
- Touch Target Size: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
- Color Contrast Tools: https://usecontrast.com/guide

**Touch Design:**
- Touch Design Patterns: https://ux.stackexchange.com/questions/15887/how-does-use-in-bright-sunlight-affect-how-a-web-site-should-be-designed
- Mobile First Design: https://developers.google.com/web/fundamentals/design-and-ux/principles

---

## Appendix: Battery Consumption Estimates

### Animation Battery Impact (per hour of continuous use)

| Animation Type | Battery Drain | FPS | Use Case |
|----------------|---------------|-----|----------|
| CSS Transform (GPU) | 2-3% | 60 | Ideal for transitions |
| GSAP Timeline | 3-5% | 60 | Slide transitions |
| GSAP ScrollTrigger | 4-6% | 60 | Scroll animations |
| Three.js (500 particles) | 8-12% | 60 | Background effects |
| Three.js (1000 particles) | 15-20% | 60 | Avoid on battery |
| Three.js 3D Chart | 10-15% | 30-60 | Limit to key pages |
| Video Playback | 10-15% | 30 | Use sparingly |

**Optimization Targets:**
- Baseline (no animations): ~5% drain per hour
- With GSAP animations: ~10-12% drain per hour
- With GSAP + Three.js (optimized): ~18-22% drain per hour
- Target: 3 hours continuous presentation = <33% per hour

**Strategies to Hit Target:**
1. Use battery-aware mode switching (high/balanced/saver)
2. Reduce particle counts when battery < 50%
3. Disable 3D scenes when battery < 20%
4. Use frameloop="demand" for static Three.js scenes
5. Pause animations when page not visible

---

## Appendix: Performance Benchmarks

### Target Performance Metrics

| Metric | Target | Measurement Tool |
|--------|--------|------------------|
| Lighthouse Performance | 90+ | Chrome DevTools |
| First Contentful Paint (FCP) | <1.5s | Lighthouse |
| Largest Contentful Paint (LCP) | <2.5s | Lighthouse |
| Time to Interactive (TTI) | <3.5s | Lighthouse |
| Total Blocking Time (TBT) | <200ms | Lighthouse |
| Cumulative Layout Shift (CLS) | <0.1 | Lighthouse |
| Frame Rate (Animations) | 60 FPS | Chrome Performance Tab |
| Frame Rate (3D Scenes) | 30-60 FPS | r3f-perf |
| Bundle Size (Initial) | <500KB | Vite Build Analysis |
| Bundle Size (Total) | <2MB | Vite Build Analysis |

---

## Appendix: Testing Checklist

### Pre-Launch Checklist

**Functionality:**
- [ ] All page transitions work smoothly
- [ ] Swipe navigation works left/right
- [ ] All GSAP animations play correctly
- [ ] Three.js scenes render without errors
- [ ] Touch gestures respond within 100ms
- [ ] No JavaScript errors in console

**Performance:**
- [ ] Lighthouse Performance score 90+
- [ ] Battery life 3+ hours at 50% brightness
- [ ] Frame rate stays above 30 FPS
- [ ] No memory leaks (test with Chrome DevTools)
- [ ] Service worker caches assets correctly
- [ ] Offline mode works for all cached pages

**Touch & Accessibility:**
- [ ] All buttons meet 44x44px minimum
- [ ] Touch targets have visible feedback
- [ ] Swipe gestures don't conflict with scrolling
- [ ] Pinch-to-zoom works on images
- [ ] Long-press menus appear reliably
- [ ] High contrast mode passes WCAG AAA

**Device Compatibility:**
- [ ] Works on webOS TV 22 (Chrome 68)
- [ ] WebGL scenes render correctly
- [ ] No ES2019+ syntax errors
- [ ] Orientation changes handled smoothly
- [ ] Fullscreen mode works
- [ ] Battery API integration works

**Content:**
- [ ] All animations enhance (not distract)
- [ ] 3D visualizations are intuitive
- [ ] Text remains readable in all modes
- [ ] Images load progressively
- [ ] No performance degradation after 30 min use

---

## Conclusion

This enhancement plan provides a comprehensive roadmap to transform the AI Presenter application into a world-class presentation platform optimized for the LG StandbyME Go 27LX5. By strategically integrating GSAP for smooth animations and Three.js for immersive 3D visualizations, while maintaining excellent battery efficiency and touch optimization, the application will deliver an impressive, professional presentation experience that stands out in field demonstrations.

**Key Success Factors:**
1. **Prioritize Quick Wins** - Implement Phase 1-2 first for immediate visual impact
2. **Monitor Performance** - Use battery manager and r3f-perf throughout development
3. **Test on Device** - Regularly test on actual LG StandbyME or webOS simulator
4. **Progressive Enhancement** - Ensure fallbacks for WebGL and older browsers
5. **User Feedback** - Gather feedback from presenters in field conditions

**Next Steps:**
1. Review this plan with stakeholders
2. Set up development environment (Phase 1)
3. Begin implementation with Quick Wins (Phase 2)
4. Schedule weekly progress reviews
5. Plan device testing sessions

---

**Document prepared by:** Claude Code (LG StandbyME Optimizer Agent)
**For questions or clarifications, refer to the Resources & References section above.**
