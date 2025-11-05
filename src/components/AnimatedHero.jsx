import { motion } from 'framer-motion'
import { transitions, staggerChildren, fadeInUp } from '@/lib/animation-config'

export default function AnimatedHero({ title, subtitle, cta, onCtaClick, children }) {
  return (
    <motion.section
      className="relative w-full"
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      {title && (
        <motion.h1
          variants={fadeInUp}
          transition={transitions.spring}
          className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6"
        >
          {title}
        </motion.h1>
      )}

      {subtitle && (
        <motion.p
          variants={fadeInUp}
          transition={transitions.smooth}
          className="text-xl md:text-2xl mb-8 text-white/80"
        >
          {subtitle}
        </motion.p>
      )}

      {cta && (
        <motion.div
          variants={fadeInUp}
          transition={transitions.bouncy}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCtaClick}
            className="px-8 py-4 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-bold rounded-lg text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            {cta}
          </motion.button>
        </motion.div>
      )}

      {children && (
        <motion.div
          variants={fadeInUp}
          transition={transitions.smooth}
        >
          {children}
        </motion.div>
      )}
    </motion.section>
  )
}
