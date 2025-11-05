import { motion } from 'framer-motion'
import { buttonHover, buttonTap } from '@/lib/animation-config'

export default function TouchFeedback({ children, onClick, className = '', variant = 'default', ...props }) {
  const variants = {
    default: {
      whileTap: { scale: 0.97 },
      whileHover: { scale: 1.02 }
    },
    button: {
      whileTap: buttonTap,
      whileHover: buttonHover
    },
    card: {
      whileTap: { scale: 0.98 },
      whileHover: {
        y: -8,
        boxShadow: "0 20px 25px -5px rgba(212, 175, 55, 0.2), 0 10px 10px -5px rgba(212, 175, 55, 0.1)"
      }
    },
    subtle: {
      whileTap: { scale: 0.99 },
      whileHover: { scale: 1.01 }
    }
  }

  const selectedVariant = variants[variant] || variants.default

  return (
    <motion.div
      className={className}
      onClick={onClick}
      whileTap={selectedVariant.whileTap}
      whileHover={selectedVariant.whileHover}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {children}
    </motion.div>
  )
}
