import { motion, m } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

const variants = {
  gold: 'bg-gold text-black hover:bg-gold-dark',
  dark: 'bg-black text-white hover:bg-black-charcoal',
  outline: 'bg-transparent text-black border border-black hover:bg-black hover:text-white',
  outlineGold: 'bg-transparent text-gold-dark border border-gold hover:bg-gold hover:text-black',
}

const MotionLink = motion.create(Link)

export default function PrimaryButton({
  children,
  as = 'button',
  variant = 'gold',
  loading = false,
  className = '',
  ...props
}) {
  const Component = as === 'link' ? MotionLink : as === 'a' ? motion.a : motion.button

  return (
    <Component
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300 disabled:opacity-60 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Component>
  )
}