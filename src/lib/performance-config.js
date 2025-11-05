// Battery-aware performance configuration for LG StandbyME optimization

export const getPerformanceMode = async () => {
  if (typeof navigator === 'undefined') return 'high'

  try {
    // Check battery level
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery()
      const level = battery.level * 100

      if (level > 50) return 'high'
      if (level > 20) return 'balanced'
      return 'saver'
    }

    // Fallback to high if battery API not available
    return 'high'
  } catch (error) {
    console.warn('Battery API not available:', error)
    return 'high'
  }
}

export const performanceProfiles = {
  high: {
    enableParticles: true,
    enable3D: true,
    animationQuality: 'high',
    fps: 60,
    particleCount: 1000,
    enableBlur: true,
    enableShadows: true
  },
  balanced: {
    enableParticles: false,
    enable3D: true,
    animationQuality: 'medium',
    fps: 30,
    particleCount: 500,
    enableBlur: false,
    enableShadows: true
  },
  saver: {
    enableParticles: false,
    enable3D: false,
    animationQuality: 'low',
    fps: 30,
    particleCount: 0,
    enableBlur: false,
    enableShadows: false
  }
}

// Device-specific optimizations
export const deviceConfig = {
  lgStandbyME: {
    screenWidth: 1920,
    screenHeight: 1080,
    touchEnabled: true,
    batteryCapacity: 3, // hours
    recommendedProfile: 'balanced'
  }
}

// Check if reduced motion is preferred
export const prefersReducedMotion = () => {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Get optimal FPS based on device capabilities
export const getOptimalFPS = (performanceMode) => {
  if (prefersReducedMotion()) return 30
  return performanceProfiles[performanceMode].fps
}
