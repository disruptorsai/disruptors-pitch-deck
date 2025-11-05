# AI Presenter - 2025 Animation Implementation Plan

**Last Updated:** October 17, 2025
**Status:** Ready for Implementation
**Tech Stack:** Framer Motion v11 + GSAP 3.12 + Lenis + React Three Fiber v8

---

## Executive Summary

This document outlines the complete implementation of cutting-edge animations and interactions for the AI Presenter application, optimized for the LG StandbyME Go 27LX5 touchscreen device.

### Goals
1. Create a mind-blowing visual experience that competitors cannot match
2. Optimize for touch interactions and battery efficiency
3. Use the latest 2025 best practices and libraries
4. Deliver professional, Apple-like polish

### Tech Stack (Modern 2025)

| Library | Version | Size | Purpose |
|---------|---------|------|---------|
| **Framer Motion** | ^11.15.0 | 32KB | Primary animations, gestures, layout |
| **GSAP** | ^3.12.5 | 23KB | Scroll animations, complex timelines |
| **Lenis** | ^1.1.0 | 2.1KB | Smooth scroll |
| **React Three Fiber** | ^8.17.0 | - | 3D visualizations |
| **@react-three/drei** | ^9.117.0 | - | R3F utilities |
| **Three.js** | ^0.170.0 | - | 3D engine |
| **TOTAL** | - | **~190KB** | Complete animation system |

---

## Phase 1: Foundation Setup (Week 1)

### 1.1 Install Dependencies

```bash
npm install framer-motion@^11.15.0 gsap@^3.12.5 lenis@^1.1.0
npm install @react-three/fiber@^8.17.0 @react-three/drei@^9.117.0 three@^0.170.0
```

### 1.2 Create Animation Utilities

**File:** `src/lib/animation-config.js`
```javascript
// Shared animation configurations
export const transitions = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  smooth: {
    type: "tween",
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96]
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 25
  }
}

export const pageTransitions = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
}

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -40 }
}
```

**File:** `src/lib/performance-config.js`
```javascript
// Battery-aware performance configuration
export const getPerformanceMode = () => {
  if (typeof navigator === 'undefined') return 'high'

  const battery = navigator.getBattery?.()
  if (!battery) return 'high'

  const level = battery.level * 100

  if (level > 50) return 'high'
  if (level > 20) return 'balanced'
  return 'saver'
}

export const performanceProfiles = {
  high: {
    enableParticles: true,
    enable3D: true,
    animationQuality: 'high',
    fps: 60
  },
  balanced: {
    enableParticles: false,
    enable3D: true,
    animationQuality: 'medium',
    fps: 30
  },
  saver: {
    enableParticles: false,
    enable3D: false,
    animationQuality: 'low',
    fps: 30
  }
}
```

### 1.3 Set Up Lenis Smooth Scroll

**File:** `src/components/SmoothScroll.jsx`
```jsx
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useLocation } from 'react-router-dom'

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false, // Disable on touch for native feel
      touchMultiplier: 2,
      infinite: false,
    })

    lenisRef.current = lenis

    // Animation frame loop
    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [location.pathname])

  return <>{children}</>
}
```

**Update:** `src/App.jsx` - Wrap with SmoothScroll
```jsx
import SmoothScroll from '@/components/SmoothScroll'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <RouterProvider router={router} />
      </SmoothScroll>
    </QueryClientProvider>
  )
}
```

---

## Phase 2: Framer Motion Page Transitions (Week 1-2)

### 2.1 Create Page Transition Wrapper

**File:** `src/components/PageTransition.jsx`
```jsx
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { transitions, pageTransitions } from '@/lib/animation-config'

export default function PageTransition({ children }) {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={pageTransitions.initial}
        animate={pageTransitions.animate}
        exit={pageTransitions.exit}
        transition={transitions.smooth}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
```

### 2.2 Update Layout Component

**File:** `src/pages/Layout.jsx` - Add PageTransition wrapper
```jsx
import PageTransition from '@/components/PageTransition'

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
    </div>
  )
}
```

---

## Phase 3: Hero Section Animations (Week 2)

### 3.1 Animated Hero Component

**File:** `src/components/AnimatedHero.jsx`
```jsx
import { motion } from 'framer-motion'
import { transitions, staggerChildren, fadeInUp } from '@/lib/animation-config'

export default function AnimatedHero({ title, subtitle, cta }) {
  return (
    <motion.section
      className="hero-section"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <motion.h1
        variants={fadeInUp}
        transition={transitions.spring}
        className="text-6xl font-bold"
      >
        {title}
      </motion.h1>

      <motion.p
        variants={fadeInUp}
        transition={transitions.smooth}
        className="text-xl mt-4"
      >
        {subtitle}
      </motion.p>

      <motion.div
        variants={fadeInUp}
        transition={transitions.bouncy}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="cta-button mt-8"
        >
          {cta}
        </motion.button>
      </motion.div>
    </motion.section>
  )
}
```

### 3.2 Update Home Page

**File:** `src/pages/Home.jsx` - Replace static hero with animated version
```jsx
import AnimatedHero from '@/components/AnimatedHero'

export default function Home() {
  return (
    <div className="home-page">
      <AnimatedHero
        title="Transform Your Business"
        subtitle="AI-Powered Marketing Solutions"
        cta="Get Started"
      />
      {/* Rest of page */}
    </div>
  )
}
```

---

## Phase 4: Touch Gestures & Swipe Navigation (Week 2-3)

### 4.1 Swipe Navigation Hook

**File:** `src/hooks/use-swipe-navigation.js`
```javascript
import { useNavigate } from 'react-router-dom'

const pageOrder = [
  '/home',
  '/dashboard',
  '/introduction',
  '/diagnostic',
  '/services',
  '/blueprint',
  '/casestudies',
  '/competitive-analysis',
  '/team',
  '/pricing'
]

export function useSwipeNavigation() {
  const navigate = useNavigate()

  const handleSwipe = (info) => {
    const currentPath = window.location.pathname
    const currentIndex = pageOrder.findIndex(path =>
      currentPath.toLowerCase().includes(path.slice(1))
    )

    if (currentIndex === -1) return

    const { offset, velocity } = info
    const swipeThreshold = 50
    const velocityThreshold = 500

    // Swipe left -> next page
    if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
      const nextIndex = Math.min(currentIndex + 1, pageOrder.length - 1)
      navigate(pageOrder[nextIndex])
    }
    // Swipe right -> previous page
    else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
      const prevIndex = Math.max(currentIndex - 1, 0)
      navigate(pageOrder[prevIndex])
    }
  }

  return { handleSwipe, pageOrder }
}
```

### 4.2 Touch Feedback Component

**File:** `src/components/TouchFeedback.jsx`
```jsx
import { motion } from 'framer-motion'

export default function TouchFeedback({ children, ...props }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
```

### 4.3 Add Swipe to Layout

**File:** `src/pages/Layout.jsx` - Add swipe gesture
```jsx
import { motion } from 'framer-motion'
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation'

export default function Layout() {
  const { handleSwipe } = useSwipeNavigation()

  return (
    <motion.div
      className="min-h-screen"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(e, info) => handleSwipe(info)}
    >
      <Navigation />
      <PageTransition>
        <Outlet />
      </PageTransition>
      <Footer />
    </motion.div>
  )
}
```

---

## Phase 5: GSAP ScrollTrigger Animations (Week 3-4)

### 5.1 GSAP Utilities

**File:** `src/lib/gsap-utils.js`
```javascript
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const initScrollTrigger = (lenisInstance) => {
  // Sync Lenis with ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)

  gsap.ticker.lagSmoothing(0)
}

export const createScrollAnimation = (trigger, target, animationProps) => {
  return gsap.to(target, {
    scrollTrigger: {
      trigger,
      start: 'top center',
      end: 'bottom center',
      scrub: 1,
      markers: false // Set to true for debugging
    },
    ...animationProps
  })
}

export const createParallax = (element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: -50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
}
```

### 5.2 Scroll Animation Component

**File:** `src/components/ScrollReveal.jsx`
```jsx
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollReveal({ children, animation = 'fade' }) {
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const animations = {
      fade: { opacity: 0, y: 50 },
      slide: { x: -100, opacity: 0 },
      scale: { scale: 0.8, opacity: 0 }
    }

    gsap.fromTo(
      element,
      animations[animation],
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [animation])

  return <div ref={elementRef}>{children}</div>
}
```

---

## Phase 6: Animated Counters & Metrics (Week 4)

### 6.1 Animated Counter Component

**File:** `src/components/AnimatedCounter.jsx`
```jsx
import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export default function AnimatedCounter({ value, duration = 2, suffix = '' }) {
  const ref = useRef(null)
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  })
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [motionValue, isInView, value])

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(
          Math.floor(latest)
        ) + suffix
      }
    })
  }, [springValue, suffix])

  return <span ref={ref}>0{suffix}</span>
}
```

### 6.2 Dashboard Metrics Update

**File:** `src/pages/Dashboard.jsx` - Add animated counters
```jsx
import AnimatedCounter from '@/components/AnimatedCounter'
import { motion } from 'framer-motion'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <motion.div
        className="metrics-grid"
        initial="initial"
        animate="animate"
        variants={{
          animate: {
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <motion.div
          className="metric-card"
          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
        >
          <h3>Revenue Growth</h3>
          <AnimatedCounter value={327} suffix="%" />
        </motion.div>

        <motion.div
          className="metric-card"
          variants={{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } }}
        >
          <h3>Active Clients</h3>
          <AnimatedCounter value={142} />
        </motion.div>

        {/* More metrics */}
      </motion.div>
    </div>
  )
}
```

---

## Phase 7: Three.js 3D Visualizations (Week 4-5)

### 7.1 3D Bar Chart Component

**File:** `src/components/3d/BarChart3D.jsx`
```jsx
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion-3d'
import { Suspense } from 'react'

function Bar({ position, height, color, delay }) {
  return (
    <motion.mesh
      position={position}
      initial={{ scale: [1, 0, 1] }}
      animate={{ scale: [1, height, 1] }}
      transition={{ duration: 1, delay, type: 'spring' }}
    >
      <boxGeometry args={[0.8, 1, 0.8]} />
      <meshStandardMaterial color={color} />
    </motion.mesh>
  )
}

export default function BarChart3D({ data }) {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <OrbitControls enableZoom={true} enablePan={false} />

          {data.map((item, i) => (
            <Bar
              key={i}
              position={[i * 1.5 - (data.length * 1.5) / 2, 0, 0]}
              height={item.value / 100}
              color={item.color || '#D4AF37'}
              delay={i * 0.1}
            />
          ))}

          <gridHelper args={[10, 10]} />
        </Suspense>
      </Canvas>
    </div>
  )
}
```

### 7.2 Particle Background Component

**File:** `src/components/3d/ParticleBackground.jsx`
```jsx
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { useRef, useMemo } from 'react'
import * as THREE from 'three'

function ParticleField({ count = 1000 }) {
  const pointsRef = useRef()

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10
    }

    return positions
  }, [count])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.075
    }
  })

  return (
    <Points ref={pointsRef} positions={particles} stride={3}>
      <PointMaterial
        transparent
        color="#D4AF37"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  )
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ParticleField />
      </Canvas>
    </div>
  )
}
```

### 7.3 Update Case Studies Page

**File:** `src/pages/CaseStudies.jsx` - Add 3D charts
```jsx
import BarChart3D from '@/components/3d/BarChart3D'
import { motion } from 'framer-motion'

export default function CaseStudies() {
  const chartData = [
    { label: 'Q1', value: 150, color: '#D4AF37' },
    { label: 'Q2', value: 280, color: '#FFD700' },
    { label: 'Q3', value: 420, color: '#D4AF37' },
    { label: 'Q4', value: 650, color: '#FFD700' }
  ]

  return (
    <div className="case-studies">
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2>Revenue Growth Over Time</h2>
        <BarChart3D data={chartData} />
      </motion.section>
    </div>
  )
}
```

---

## Phase 8: Loading States & Skeletons (Week 5)

### 8.1 Skeleton Component

**File:** `src/components/Skeleton.jsx`
```jsx
import { motion } from 'framer-motion'

export default function Skeleton({ className, variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4'
  }

  return (
    <motion.div
      className={`bg-gray-200 ${variants[variant]} ${className}`}
      animate={{
        opacity: [0.5, 0.8, 0.5]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
```

### 8.2 Page Skeleton

**File:** `src/components/PageSkeleton.jsx`
```jsx
import Skeleton from './Skeleton'
import { motion } from 'framer-motion'

export default function PageSkeleton() {
  return (
    <motion.div
      className="p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Skeleton className="w-64 h-12 mb-4" />
      <Skeleton className="w-full h-64 mb-8" />
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </motion.div>
  )
}
```

---

## Phase 9: Performance Optimization (Week 6)

### 9.1 Performance Monitor Hook

**File:** `src/hooks/use-performance-monitor.js`
```javascript
import { useEffect, useState } from 'react'
import { getPerformanceMode, performanceProfiles } from '@/lib/performance-config'

export function usePerformanceMonitor() {
  const [performanceMode, setPerformanceMode] = useState('high')
  const [profile, setProfile] = useState(performanceProfiles.high)

  useEffect(() => {
    const checkPerformance = async () => {
      const mode = await getPerformanceMode()
      setPerformanceMode(mode)
      setProfile(performanceProfiles[mode])
    }

    checkPerformance()

    // Check every 30 seconds
    const interval = setInterval(checkPerformance, 30000)

    return () => clearInterval(interval)
  }, [])

  return { performanceMode, profile }
}
```

### 9.2 Conditional 3D Rendering

**File:** `src/components/3d/Conditional3D.jsx`
```jsx
import { Suspense, lazy } from 'react'
import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'
import Skeleton from '@/components/Skeleton'

const BarChart3D = lazy(() => import('./BarChart3D'))
const BarChart2D = lazy(() => import('@/components/BarChart2D'))

export default function ConditionalChart({ data }) {
  const { profile } = usePerformanceMonitor()

  return (
    <Suspense fallback={<Skeleton className="w-full h-[500px]" />}>
      {profile.enable3D ? (
        <BarChart3D data={data} />
      ) : (
        <BarChart2D data={data} />
      )}
    </Suspense>
  )
}
```

---

## Phase 10: Dark Mode (Week 6)

### 10.1 Dark Mode Toggle

**File:** `src/components/DarkModeToggle.jsx`
```jsx
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    if (saved) setIsDark(JSON.parse(saved))
  }, [])

  const toggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem('darkMode', JSON.stringify(newValue))
    document.documentElement.classList.toggle('dark', newValue)
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.95 }}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? '🌙' : '☀️'}
      </motion.div>
    </motion.button>
  )
}
```

---

## Implementation Checklist

### Week 1-2: Foundation
- [ ] Install all dependencies
- [ ] Create animation config files
- [ ] Set up Lenis smooth scroll
- [ ] Implement page transitions
- [ ] Add hero section animations
- [ ] Create touch feedback components

### Week 3-4: Interactions & Scroll
- [ ] Implement swipe navigation
- [ ] Add GSAP ScrollTrigger animations
- [ ] Create scroll reveal components
- [ ] Add animated counters
- [ ] Implement metric animations

### Week 4-5: 3D Visualizations
- [ ] Create 3D bar chart component
- [ ] Add particle background
- [ ] Integrate into case studies page
- [ ] Create 3D competitive matrix
- [ ] Add interactive 3D elements

### Week 5-6: Polish
- [ ] Add loading skeletons
- [ ] Implement performance monitoring
- [ ] Create battery-aware modes
- [ ] Add dark mode support
- [ ] Optimize bundle size

### Week 6-7: Testing & Refinement
- [ ] Test on LG StandbyME device
- [ ] Performance profiling
- [ ] Battery consumption testing
- [ ] Touch gesture refinement
- [ ] Bug fixes and polish

---

## Expected Results

### Before
- Static page loads
- No transitions
- Basic hover effects
- Click-only navigation
- 2D charts only

### After
- Cinematic page transitions
- Smooth scroll experience
- Touch-optimized interactions
- Swipe navigation
- Interactive 3D visualizations
- Animated metrics and counters
- Battery-aware performance
- Professional micro-interactions

---

## Performance Targets

| Metric | Target | Expected |
|--------|--------|----------|
| Lighthouse Score | 95+ | 90-95 |
| First Paint | <1s | ~0.8s |
| Bundle Size | <500KB | ~380KB |
| Battery Drain | <25%/hr | 18-22%/hr |
| Animation FPS | 60fps | 55-60fps |
| Touch Response | <100ms | ~50ms |

---

## Success Metrics

**Technical:**
- All animations run at 60fps on LG StandbyME
- Battery lasts 3+ hours with all features enabled
- Lighthouse score >90
- Bundle size <500KB initial load

**UX:**
- Touch targets all meet 44x44px minimum
- Swipe navigation feels natural
- Page transitions are smooth
- No janky animations

**Business:**
- Client "wow" factor demonstrated
- Competitive differentiation achieved
- Professional perception enhanced
- Engagement metrics improved

---

## Next Steps

1. Review this plan with stakeholders
2. Approve timeline and resources
3. Begin Phase 1 implementation
4. Schedule weekly check-ins
5. Plan device testing sessions

**Status:** Ready to implement ✅
