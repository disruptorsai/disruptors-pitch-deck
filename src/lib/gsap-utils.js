import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Initialize ScrollTrigger with Lenis smooth scroll
export const initScrollTrigger = (lenisInstance) => {
  if (!lenisInstance) {
    console.warn('Lenis instance not provided to initScrollTrigger')
    return
  }

  // Sync Lenis with ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)

  gsap.ticker.lagSmoothing(0)
}

// Create scroll-triggered animation
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

// Create parallax effect
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

// Create stagger reveal animation
export const createStaggerReveal = (elements, options = {}) => {
  const defaults = {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out'
  }

  return gsap.from(elements, {
    ...defaults,
    ...options,
    scrollTrigger: {
      trigger: elements[0],
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      ...options.scrollTrigger
    }
  })
}

// Create counter animation
export const animateCounter = (element, endValue, duration = 2) => {
  const obj = { value: 0 }

  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.floor(obj.value).toLocaleString()
    }
  })
}

// Kill all ScrollTrigger instances
export const killAllScrollTriggers = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill())
}

// Refresh ScrollTrigger (useful after layout changes)
export const refreshScrollTrigger = () => {
  ScrollTrigger.refresh()
}
