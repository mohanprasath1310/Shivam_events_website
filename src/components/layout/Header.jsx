import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import PrimaryButton from '../common/PrimaryButton'
import Logo from '../common/Logo'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      animate={{ boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.07)' : '0 0px 0px rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
      className="hidden md:block sticky top-0 z-50 bg-white"
    >
      <div className="container-px mx-auto flex items-center justify-between h-[72px]">
        <Link to="/">
          <Logo size="md" />
        </Link>

        <nav className="flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `relative py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-gold-dark' : 'text-black/70 hover:text-black'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px] bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <PrimaryButton as="link" to="/book" className="!px-5 !py-2.5">
          Book Events
        </PrimaryButton>
      </div>
    </motion.header>
  )
}
