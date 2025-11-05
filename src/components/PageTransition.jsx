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
