// Shared animation configurations for Framer Motion

export const transitions = {
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30
  },
  smooth: {
    type: "tween",
    duration: 0.4,
    ease: [0.43, 0.13, 0.23, 0.96] // Custom cubic bezier
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 25
  },
  slow: {
    type: "tween",
    duration: 0.8,
    ease: "easeInOut"
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

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

export const slideInLeft = {
  initial: { opacity: 0, x: -100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 }
}

export const slideInRight = {
  initial: { opacity: 0, x: 100 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -100 }
}

// Hover and tap variants
export const buttonHover = {
  scale: 1.05,
  transition: transitions.bouncy
}

export const buttonTap = {
  scale: 0.95,
  transition: { duration: 0.1 }
}

export const cardHover = {
  y: -8,
  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  transition: transitions.spring
}
