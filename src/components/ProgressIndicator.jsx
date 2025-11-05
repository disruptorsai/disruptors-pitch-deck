import { motion } from 'framer-motion'
import { useSwipeNavigation } from '@/hooks/use-swipe-navigation'
import { useLocation } from 'react-router-dom'

export default function ProgressIndicator({ className = '' }) {
  const { getCurrentPageIndex, getTotalPages } = useSwipeNavigation()
  const location = useLocation()

  const currentIndex = getCurrentPageIndex()
  const totalPages = getTotalPages()

  if (currentIndex === -1) return null

  const progress = ((currentIndex + 1) / totalPages) * 100

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 ${className}`}>
      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5">
        <motion.div
          className="h-full bg-gradient-to-r from-[#D4AF37] to-[#FFD700]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>

      {/* Dots indicator */}
      <div className="flex items-center justify-center gap-2 py-3 bg-[#0E0E0E]/50 backdrop-blur-sm">
        {Array.from({ length: totalPages }).map((_, i) => (
          <motion.div
            key={i}
            className={`rounded-full transition-all ${
              i === currentIndex
                ? 'w-8 h-2 bg-gradient-to-r from-[#D4AF37] to-[#FFD700]'
                : 'w-2 h-2 bg-white/20'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  )
}
