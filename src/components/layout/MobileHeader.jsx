import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import PrimaryButton from '../common/PrimaryButton'
import Logo from '../common/Logo'

// Deliberately no hamburger menu — nav lives in MobileBottomNavigation instead.
export default function MobileHeader() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      animate={{ boxShadow: scrolled ? '0 4px 16px rgba(0,0,0,0.08)' : '0 0px 0px rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
      className="md:hidden sticky top-0 z-50 bg-white"
    >
      <div className="container-px mx-auto flex items-center justify-between h-16">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <PrimaryButton as="link" to="/book" className="!px-4 !py-2 !text-xs">
          Book Events
        </PrimaryButton>
      </div>
    </motion.header>
  )
}
