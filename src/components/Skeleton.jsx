import { motion } from 'framer-motion'

export default function Skeleton({ className = '', variant = 'rectangular' }) {
  const variants = {
    rectangular: 'rounded-md',
    circular: 'rounded-full',
    text: 'rounded h-4 w-full'
  }

  const variantClass = variants[variant] || variants.rectangular

  return (
    <motion.div
      className={`bg-gray-700/30 ${variantClass} ${className}`}
      animate={{
        opacity: [0.4, 0.8, 0.4]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    />
  )
}
