import { usePerformanceMonitor } from '@/hooks/use-performance-monitor'
import { motion, AnimatePresence } from 'framer-motion'
import { Battery, Zap, TrendingDown } from 'lucide-react'
import { useState } from 'react'

export default function PerformanceMonitor() {
  const { performanceMode, batteryLevel, profile } = usePerformanceMonitor()
  const [isVisible, setIsVisible] = useState(false)

  // Only show in development or when battery is low
  const shouldShow = import.meta.env.DEV || batteryLevel < 30

  if (!shouldShow) return null

  const modeIcons = {
    high: <Zap className="w-4 h-4" />,
    balanced: <Battery className="w-4 h-4" />,
    saver: <TrendingDown className="w-4 h-4" />
  }

  const modeColors = {
    high: 'bg-green-500',
    balanced: 'bg-yellow-500',
    saver: 'bg-red-500'
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setIsVisible(!isVisible)}
        whileTap={{ scale: 0.95 }}
        className="p-3 bg-gray-900/90 backdrop-blur-sm rounded-full shadow-lg border border-white/10"
      >
        {modeIcons[performanceMode]}
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-full right-0 mb-2 p-4 bg-gray-900/95 backdrop-blur-lg rounded-lg shadow-xl border border-white/10 min-w-[250px]"
          >
            <h3 className="text-sm font-semibold text-white mb-3">Performance Mode</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Mode</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${modeColors[performanceMode]}`} />
                  <span className="text-sm text-white capitalize">{performanceMode}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-white/70">Battery</span>
                <span className="text-sm text-white">{batteryLevel}%</span>
              </div>

              <div className="pt-2 border-t border-white/10">
                <div className="text-xs text-white/50 space-y-1">
                  <div>3D: {profile.enable3D ? '✓' : '✗'}</div>
                  <div>Particles: {profile.enableParticles ? '✓' : '✗'}</div>
                  <div>FPS: {profile.fps}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
