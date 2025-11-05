# Quick Start: Adding GSAP & Three.js to AI Presenter

This is a condensed, step-by-step guide to get your first animations running quickly.

## Prerequisites

```bash
# Make sure you're in the project directory
cd "C:\Users\Will\OneDrive\Documents\Projects\AI Presenter\disruptors-ai-pitch-deck-74a1c8d5 (1)\disruptors-pitch-deck"

# Ensure dependencies are installed
npm install
```

---

## Step 1: Install Animation Libraries (5 minutes)

```bash
# Core animation libraries
npm install gsap @gsap/react

# 3D visualization libraries
npm install three @react-three/fiber @react-three/drei

# Touch gesture library
npm install @use-gesture/react

# Optional: Lottie animations
npm install lottie-react

# Optional: Performance monitoring (dev only)
npm install --save-dev r3f-perf
```

---

## Step 2: Your First GSAP Animation (15 minutes)

### Create a Simple Page Transition

Edit `src/pages/Layout.jsx` to add a fade-in animation to page changes:

```jsx
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

gsap.registerPlugin(useGSAP);

function Layout({ children, currentPageName }) {
  const contentRef = useRef();

  // Animate page content when it changes
  useGSAP(() => {
    gsap.fromTo(contentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
    );
  }, { dependencies: [currentPageName], scope: contentRef });

  return (
    <div className="min-h-screen">
      {/* Your existing layout code */}
      <main ref={contentRef}>
        {children}
      </main>
    </div>
  );
}

export default Layout;
```

**Test it:** Navigate between pages and watch them fade in smoothly!

---

## Step 3: Add a Counting Animation (20 minutes)

### Animated Number Counter for Dashboard

Edit `src/pages/Dashboard.jsx`:

```jsx
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(useGSAP, ScrollTrigger);

function MetricCard({ value, label, suffix = '%' }) {
  const numberRef = useRef();
  const [displayValue, setDisplayValue] = useState(0);

  useGSAP(() => {
    gsap.to({ val: 0 }, {
      val: value,
      duration: 2,
      ease: 'power2.out',
      onUpdate: function() {
        setDisplayValue(Math.ceil(this.targets()[0].val));
      },
      scrollTrigger: {
        trigger: numberRef.current,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });
  }, { dependencies: [value], scope: numberRef });

  return (
    <div ref={numberRef} className="bg-card p-6 rounded-lg">
      <div className="text-5xl font-bold text-primary">
        {displayValue}{suffix}
      </div>
      <div className="text-sm text-muted-foreground mt-2">
        {label}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard value={87} label="Client Satisfaction" />
        <MetricCard value={142} label="Projects Completed" suffix="" />
        <MetricCard value={95} label="On-Time Delivery" />
      </div>
    </div>
  );
}
```

**Test it:** Scroll down on the dashboard and watch numbers count up!

---

## Step 4: Add Touch Swipe Navigation (30 minutes)

### Enable Swipe Between Slides

Create a new file `src/components/SwipeableLayout.jsx`:

```jsx
import { useGesture } from '@use-gesture/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';

const PAGES = [
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

export function SwipeableLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [swipeOffset, setSwipeOffset] = useState(0);

  const currentIndex = PAGES.indexOf(location.pathname);

  const bind = useGesture({
    onDrag: ({ movement: [mx], direction: [xDir], velocity: [vx], cancel, last }) => {
      // Update visual feedback during drag
      setSwipeOffset(mx);

      // Determine if swipe threshold is met
      const threshold = vx > 0.5 ? 80 : 150;

      if (last) {
        // Swipe completed
        if (mx < -threshold && xDir < 0 && currentIndex < PAGES.length - 1) {
          // Next page
          navigate(PAGES[currentIndex + 1]);
        } else if (mx > threshold && xDir > 0 && currentIndex > 0) {
          // Previous page
          navigate(PAGES[currentIndex - 1]);
        }

        // Reset offset
        setSwipeOffset(0);
      }
    }
  }, {
    drag: {
      axis: 'x',
      filterTaps: true,
      bounds: { left: -300, right: 300 },
      rubberband: 0.2
    }
  });

  return (
    <div
      {...bind()}
      style={{
        transform: `translateX(${swipeOffset}px)`,
        transition: swipeOffset === 0 ? 'transform 0.3s ease-out' : 'none',
        touchAction: 'pan-y', // Allow vertical scrolling
        userSelect: 'none'
      }}
    >
      {children}
    </div>
  );
}
```

Update `src/pages/Layout.jsx` to use it:

```jsx
import { SwipeableLayout } from '@/components/SwipeableLayout';

function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen">
      {/* Navigation, header, etc. */}

      <SwipeableLayout>
        <main>
          {children}
        </main>
      </SwipeableLayout>
    </div>
  );
}
```

**Test it:** Swipe left/right on any page to navigate!

---

## Step 5: Add Your First 3D Visualization (45 minutes)

### Create a Simple 3D Chart

Create `src/components/charts/Chart3D.jsx`:

```jsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useRef } from 'react';

function Bar3D({ position, height, color, label, value }) {
  const meshRef = useRef();

  return (
    <group position={position}>
      {/* 3D Bar */}
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Value Label */}
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.4}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Axis Label */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        {label}
      </Text>
    </group>
  );
}

export function Chart3D({ data }) {
  const maxValue = Math.max(...data.map(d => d.value));
  const spacing = 1.5;

  return (
    <div className="h-96 w-full bg-black/10 rounded-lg">
      <Canvas camera={{ position: [0, 3, 8], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />

        {/* Grid Helper */}
        <gridHelper args={[10, 10, '#444', '#222']} />

        {/* Bars */}
        {data.map((item, i) => (
          <Bar3D
            key={item.label}
            position={[
              (i - (data.length - 1) / 2) * spacing,
              0,
              0
            ]}
            height={(item.value / maxValue) * 4}
            color={item.color || '#4A90E2'}
            label={item.label}
            value={item.value}
          />
        ))}

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          touches={{
            ONE: 1, // Single touch to rotate
            TWO: 2  // Two fingers for zoom
          }}
        />
      </Canvas>
    </div>
  );
}
```

### Use the 3D Chart

In `src/pages/CaseStudies.jsx`:

```jsx
import { Chart3D } from '@/components/charts/Chart3D';

export default function CaseStudies() {
  const performanceData = [
    { label: 'Q1', value: 85, color: '#4A90E2' },
    { label: 'Q2', value: 92, color: '#50C878' },
    { label: 'Q3', value: 78, color: '#FFB347' },
    { label: 'Q4', value: 95, color: '#FF6B6B' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Case Studies</h1>

      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">
          Quarterly Performance
        </h2>
        <Chart3D data={performanceData} />
        <p className="text-sm text-muted-foreground mt-2">
          Touch and drag to rotate the chart
        </p>
      </div>

      {/* Rest of your case studies content */}
    </div>
  );
}
```

**Test it:** Visit the Case Studies page and interact with the 3D chart!

---

## Step 6: Add Touch Feedback to Buttons (20 minutes)

### Create Touch Ripple Effect

Create `src/components/ui/touch-ripple.jsx`:

```jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TouchRipple({ children, className = '', ...props }) {
  const [ripples, setRipples] = useState([]);

  const handleTouchStart = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    const ripple = { x, y, id: Date.now() };
    setRipples(prev => [...prev, ripple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== ripple.id));
    }, 600);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      {...props}
    >
      {children}

      <AnimatePresence>
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y
            }}
            initial={{ width: 0, height: 0, x: 0, y: 0 }}
            animate={{
              width: 300,
              height: 300,
              x: -150,
              y: -150,
              opacity: [0.5, 0]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
```

### Apply to Buttons

Wrap any button or interactive element:

```jsx
import { TouchRipple } from '@/components/ui/touch-ripple';
import { Button } from '@/components/ui/button';

function MyComponent() {
  return (
    <TouchRipple>
      <Button size="lg">
        Click Me
      </Button>
    </TouchRipple>
  );
}
```

**Test it:** Tap any wrapped button and see the ripple effect!

---

## Step 7: Optimize for Battery Life (15 minutes)

### Add Battery-Aware Mode

Create `src/lib/battery-manager.ts`:

```typescript
type PerformanceMode = 'high' | 'balanced' | 'saver';

class BatteryManager {
  private static instance: BatteryManager;
  private battery: any = null;
  private mode: PerformanceMode = 'high';

  static getInstance(): BatteryManager {
    if (!this.instance) {
      this.instance = new BatteryManager();
    }
    return this.instance;
  }

  async initialize() {
    if ('getBattery' in navigator) {
      try {
        this.battery = await (navigator as any).getBattery();
        this.updateMode();

        this.battery.addEventListener('levelchange', () => this.updateMode());
        this.battery.addEventListener('chargingchange', () => this.updateMode());
      } catch (error) {
        console.warn('Battery API not supported');
      }
    }
  }

  private updateMode() {
    if (!this.battery) return;

    const { level, charging } = this.battery;

    if (charging) {
      this.mode = 'high';
    } else if (level < 0.2) {
      this.mode = 'saver';
    } else if (level < 0.5) {
      this.mode = 'balanced';
    } else {
      this.mode = 'high';
    }
  }

  getMode(): PerformanceMode {
    return this.mode;
  }
}

export const batteryManager = BatteryManager.getInstance();
batteryManager.initialize();
```

### Use in Components

```jsx
import { batteryManager } from '@/lib/battery-manager';
import { useEffect, useState } from 'react';

function ParticleBackground() {
  const [particleCount, setParticleCount] = useState(1000);

  useEffect(() => {
    const checkBattery = () => {
      const mode = batteryManager.getMode();

      switch(mode) {
        case 'high':
          setParticleCount(1000);
          break;
        case 'balanced':
          setParticleCount(500);
          break;
        case 'saver':
          setParticleCount(100);
          break;
      }
    };

    checkBattery();
    const interval = setInterval(checkBattery, 30000); // Check every 30s

    return () => clearInterval(interval);
  }, []);

  return (
    <Canvas>
      <Particles count={particleCount} />
    </Canvas>
  );
}
```

---

## Performance Testing Checklist

After implementing animations, test these:

### Browser DevTools Performance

1. Open Chrome DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Navigate through your app for 30 seconds
5. Stop recording
6. Check for:
   - Frame rate staying above 30 FPS
   - No long tasks (>50ms)
   - Smooth animations

### Lighthouse Audit

1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select "Performance" + "Accessibility"
4. Click "Analyze page load"
5. Target scores:
   - Performance: 90+
   - Accessibility: 90+

### Battery Test (if on device)

1. Charge to 100%
2. Start presentation
3. Navigate through all slides
4. Leave running for 1 hour
5. Check battery level
6. Should drain <35% per hour

---

## Troubleshooting

### GSAP animations not working

**Check:**
1. Did you import and register plugins?
   ```jsx
   import { useGSAP } from '@gsap/react';
   import gsap from 'gsap';
   gsap.registerPlugin(useGSAP);
   ```

2. Are you using refs correctly?
   ```jsx
   const ref = useRef();
   useGSAP(() => { gsap.to(ref.current, {...}) }, { scope: ref });
   ```

3. Check console for errors

### Three.js scene is black

**Check:**
1. Do you have lights?
   ```jsx
   <ambientLight intensity={0.5} />
   <directionalLight position={[5, 5, 5]} />
   ```

2. Is the camera positioned correctly?
   ```jsx
   <Canvas camera={{ position: [0, 0, 5] }}>
   ```

3. Are materials visible?
   ```jsx
   <meshStandardMaterial color="blue" />
   ```

### Touch gestures not responding

**Check:**
1. Did you install @use-gesture?
   ```bash
   npm install @use-gesture/react
   ```

2. Is touchAction set?
   ```jsx
   style={{ touchAction: 'pan-y' }} // or 'none'
   ```

3. Are you binding gestures?
   ```jsx
   const bind = useGesture({...});
   <div {...bind()}>
   ```

### Poor performance

**Optimize:**
1. Reduce particle counts
2. Use `frameloop="demand"` on Canvas
3. Disable shadows
4. Use BasicMaterial instead of StandardMaterial
5. Check battery mode is working

---

## Next Steps

Once you've completed these quick start steps:

1. Review the full enhancement plan: `docs/LG_STANDBYME_ENHANCEMENT_PLAN.md`
2. Implement Phase 2 Quick Wins for maximum impact
3. Add 3D visualizations to high-traffic pages
4. Test on actual LG StandbyME device or webOS simulator
5. Optimize based on real-world usage

---

## Resources

- GSAP Docs: https://gsap.com/docs/v3/
- R3F Docs: https://docs.pmnd.rs/react-three-fiber
- @use-gesture: https://use-gesture.netlify.app/
- Full Enhancement Plan: `docs/LG_STANDBYME_ENHANCEMENT_PLAN.md`

---

**Questions?** Check the troubleshooting section or refer to the full enhancement plan document.
