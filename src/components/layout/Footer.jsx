import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Instagram, Youtube, Facebook, Phone, MapPin, Clock } from 'lucide-react'
import { fadeUp, viewportOnce } from '../../animations/variants'
import Logo from '../common/Logo'

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/videos', label: 'Videos' },
  { to: '/contact', label: 'Contact' },
  { to: '/book', label: 'Book Event' },
]

export default function Footer({ settings }) {
  const {
    business_name = 'Shivam Events',
    phone_1,
    phone_2,
    address,
    working_hours,
    instagram,
    instagram_2,
    youtube,
    facebook,
  } = settings || {}

  const socialLinks = (
    <div className="flex gap-3 mt-5">
      {instagram && (
        <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
          className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-gold hover:text-black hover:border-gold transition-colors">
          <Instagram className="h-4 w-4" />
        </a>
      )}
      {youtube && (
        <a href={youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"
          className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-gold hover:text-black hover:border-gold transition-colors">
          <Youtube className="h-4 w-4" />
        </a>
      )}
      {facebook && (
        <a href={facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
          className="h-9 w-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-gold hover:text-black hover:border-gold transition-colors">
          <Facebook className="h-4 w-4" />
        </a>
      )}
    </div>
  )

  return (
    <motion.footer
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className="bg-black text-white pt-16 pb-28 md:pb-10"
    >
      <div className="container-px mx-auto">

        {/* ── MOBILE layout (hidden on md+) ── */}
        <div className="md:hidden">
          {/* Logo full width */}
          <div className="mb-8">
            <Logo size="lg" dark align="start" />
            <p className="mt-3 text-sm text-white/60">Make Your Event Memorable</p>
            {socialLinks}
          </div>

          {/* 3-col grid: Quick Links | Contact | Working Hours */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-sm tracking-wide text-white/90">Quick Links</h4>
              <ul className="mt-4 space-y-2.5">
                {QUICK_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-white/60 hover:text-gold transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm tracking-wide text-white/90">Contact</h4>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                {phone_1 && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold shrink-0" /> {phone_1}</li>}
                {phone_2 && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold shrink-0" /> {phone_2}</li>}
                {address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /> {address}</li>}
                {instagram && <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-gold shrink-0" /> @{instagram}</li>}
                {instagram_2 && <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-gold shrink-0" /> @{instagram_2}</li>}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-sm tracking-wide text-white/90">Working Hours</h4>
              <div className="mt-4 flex items-start gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span>{working_hours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── DESKTOP layout (hidden on mobile) — original 4-col grid ── */}
        <div className="hidden md:grid md:grid-cols-4 gap-10">
          <div>
            <Logo size="lg" dark align="start" />
            <p className="mt-3 text-sm text-white/60">Make Your Event Memorable</p>
            {socialLinks}
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide text-white/90">Quick Links</h4>
            <ul className="mt-4 space-y-2.5">
              {QUICK_LINKS.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-white/60 hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide text-white/90">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              {phone_1 && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold shrink-0" /> {phone_1}</li>}
              {phone_2 && <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold shrink-0" /> {phone_2}</li>}
              {address && <li className="flex items-start gap-2"><MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" /> {address}</li>}
              {instagram && <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-gold shrink-0" /> @{instagram}</li>}
              {instagram_2 && <li className="flex items-center gap-2"><Instagram className="h-4 w-4 text-gold shrink-0" /> @{instagram_2}</li>}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm tracking-wide text-white/90">Working Hours</h4>
            <div className="mt-4 flex items-start gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4 text-gold shrink-0 mt-0.5" />
              <span>{working_hours}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="container-px mx-auto mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center text-xs text-white/40">
        <span>© {new Date().getFullYear()} {business_name}. All Rights Reserved.</span>
        <Link to="/admin/login" className="hover:text-gold transition-colors underline underline-offset-2">
          Admin Login
        </Link>
      </div>
    </motion.footer>
  )
}