import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check localStorage for saved preference
    const saved = localStorage.getItem('darkMode')
    if (saved) {
      setIsDark(JSON.parse(saved))
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setIsDark(prefersDark)
    }
  }, [])

  useEffect(() => {
    // Apply dark mode class
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const toggle = () => {
    const newValue = !isDark
    setIsDark(newValue)
    localStorage.setItem('darkMode', JSON.stringify(newValue))
  }

  return (
    <motion.button
      onClick={toggle}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      className={`relative p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors ${className}`}
      aria-label="Toggle dark mode"
    >
      <motion.div
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-white" />
        ) : (
          <Sun className="w-5 h-5 text-[#D4AF37]" />
        )}
      </motion.div>
    </motion.button>
  )
}
