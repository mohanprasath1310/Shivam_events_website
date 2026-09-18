import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Home, LayoutGrid, Image, Video, Tag,
  CalendarCheck, MessageSquareQuote, Mail, Phone, Settings, LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import Logo from '../common/Logo'

const ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/home-content', label: 'Home Content', icon: Home },
  { to: '/admin/services', label: 'Services', icon: LayoutGrid },
  { to: '/admin/gallery', label: 'Gallery', icon: Image },
  { to: '/admin/videos', label: 'Videos', icon: Video },
  { to: '/admin/pricing', label: 'Pricing', icon: Tag },
  { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { to: '/admin/messages', label: 'Messages', icon: Mail },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/contact', label: 'Contact Details', icon: Phone },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminSidebar({ mobile = false, onNavigate }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className={`flex flex-col h-full bg-black text-white ${mobile ? 'w-full' : 'w-64 shrink-0'}`}>
      <div className="px-6 py-6 flex items-center gap-3">
        <Logo size="sm" dark align="start" />
        <p className="text-xs text-white/40">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className="relative block"
          >
            {({ isActive }) => (
              <div className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm">
                {isActive && (
                  <motion.div
                    layoutId="admin-sidebar-active"
                    className="absolute inset-0 bg-white/10 rounded-lg"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className={`h-4 w-4 relative z-10 ${isActive ? 'text-gold' : 'text-white/60'}`} />
                <span className={`relative z-10 ${isActive ? 'text-white font-medium' : 'text-white/70'}`}>
                  {label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors w-full"
        >
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  )
}