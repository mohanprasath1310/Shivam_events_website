import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from './Header'
import MobileHeader from './MobileHeader'
import MobileBottomNavigation from './MobileBottomNavigation'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import { useSiteSettings } from '../../hooks/useSiteSettings'

export default function PublicLayout() {
  const { settings } = useSiteSettings()
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col">
      <Header businessName={settings.business_name} />
      <MobileHeader businessName={settings.business_name} />

      {/* Simple per-page fade keyed by route. No AnimatePresence/exit
          animation here — that combination could get stuck at opacity:0
          under React Strict Mode's double-render in development. */}
      <motion.main
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="flex-1"
      >
        <Outlet context={{ settings }} />
      </motion.main>

      <Footer settings={settings} />
      <WhatsAppButton number={settings.whatsapp} />
      <MobileBottomNavigation />
    </div>
  )
}
