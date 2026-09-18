import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, LayoutGrid, Image, Video, Phone } from 'lucide-react'

const ITEMS = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/services', label: 'Services', icon: LayoutGrid },
  { to: '/gallery', label: 'Gallery', icon: Image },
  { to: '/videos', label: 'Video', icon: Video },
  { to: '/contact', label: 'Contact', icon: Phone },
]

export default function MobileBottomNavigation() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-black/5 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className="relative flex flex-col items-center justify-center gap-1 py-2.5 touch-manipulation"
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={{ scale: isActive ? 1.12 : 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  <Icon
                    className="h-5 w-5"
                    strokeWidth={isActive ? 2.4 : 2}
                    color={isActive ? '#F5B82E' : '#111111'}
                    opacity={isActive ? 1 : 0.55}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-medium transition-colors ${
                    isActive ? 'text-gold-dark' : 'text-black/55'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
