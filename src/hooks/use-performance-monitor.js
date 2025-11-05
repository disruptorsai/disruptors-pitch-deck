import { useEffect, useState } from 'react'
import { getPerformanceMode, performanceProfiles } from '@/lib/performance-config'

export function usePerformanceMonitor() {
  const [performanceMode, setPerformanceMode] = useState('high')
  const [profile, setProfile] = useState(performanceProfiles.high)
  const [batteryLevel, setBatteryLevel] = useState(100)

  useEffect(() => {
    const checkPerformance = async () => {
      const mode = await getPerformanceMode()
      setPerformanceMode(mode)
      setProfile(performanceProfiles[mode])

      // Update battery level if available
      if ('getBattery' in navigator) {
        try {
          const battery = await navigator.getBattery()
          setBatteryLevel(Math.floor(battery.level * 100))
        } catch (error) {
          console.warn('Could not get battery level:', error)
        }
      }
    }

    checkPerformance()

    // Check every 30 seconds
    const interval = setInterval(checkPerformance, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    performanceMode,
    profile,
    batteryLevel,
    isHighPerformance: performanceMode === 'high',
    isSaverMode: performanceMode === 'saver'
  }
}
