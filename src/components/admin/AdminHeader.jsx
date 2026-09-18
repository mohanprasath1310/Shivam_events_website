import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/home-content': 'Home Content',
  '/admin/services': 'Services',
  '/admin/gallery': 'Gallery',
  '/admin/videos': 'Videos',
  '/admin/pricing': 'Pricing',
  '/admin/bookings': 'Bookings',
  '/admin/messages': 'Messages',
  '/admin/testimonials': 'Testimonials',
  '/admin/contact': 'Contact Details',
  '/admin/settings': 'Settings',
}

export default function AdminHeader() {
  const [open, setOpen] = useState(false)
  // Keeps the drawer markup mounted only while it's open or fading out.
  // Whether it can be TAPPED is controlled separately (via pointerEvents,
  // set the instant `open` changes) so a stalled/interrupted fade-out
  // animation can never leave an invisible overlay eating clicks — which is
  // what made the back arrow, hamburger, and every field on the next page
  // stop responding after picking a page from the mobile menu.
  const [mounted, setMounted] = useState(false)
  const location = useLocation()

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  const isDashboard = location.pathname === '/admin'
  const title = TITLES[location.pathname] || 'Admin'

  return (
    <>
      {/* Shown on every breakpoint (was mobile-only) so the back arrow and
          page title are visible on both laptop and phone. */}
      <header className="sticky top-0 z-40 bg-white border-b border-black/5 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-1 min-w-0">
          {!isDashboard && (
            <Link
              to="/admin"
              aria-label="Back to dashboard"
              className="h-10 w-10 -ml-2 flex items-center justify-center shrink-0 text-black/60 hover:text-black transition-colors touch-manipulation"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <p className="font-heading font-semibold truncate">{title}</p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="lg:hidden h-10 w-10 flex items-center justify-center -mr-2 touch-manipulation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {mounted && (
        <motion.div
          className="lg:hidden fixed inset-0 z-[60] bg-black/50"
          style={{ height: '100dvh', pointerEvents: open ? 'auto' : 'none' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          onAnimationComplete={() => {
            if (!open) setMounted(false)
          }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: open ? 0 : -280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="h-full w-64 overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 h-9 w-9 flex items-center justify-center text-white/60 hover:text-white touch-manipulation"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
              <AdminSidebar mobile onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
