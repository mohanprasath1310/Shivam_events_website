import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Disc3, PartyPopper, LayoutPanelTop, Sparkles } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { staggerContainer, fadeUp, viewportOnce } from '../../animations/variants'
import SectionHeading from '../common/SectionHeading'

// Icon lookup by slug, with a sensible fallback for any future service
// the admin adds that isn't one of the three core categories.
const ICONS = {
  'dj-events': Disc3,
  'paper-blast': PartyPopper,
  decoration: LayoutPanelTop,
}

export default function CategoryQuickAccess() {
  const [services, setServices] = useState([])

  useEffect(() => {
    supabase
      .from('services')
      .select('name, slug')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setServices(data || [])
      })
  }, [])

  if (services.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-offwhite">
      <div className="container-px mx-auto">
        <SectionHeading title="Our Event Categories" subtitle="Explore everything we bring to life" />

        <motion.div
          variants={staggerContainer(0.08)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          {services.map(({ name, slug }) => {
            const Icon = ICONS[slug] || Sparkles
            return (
              <motion.div key={slug} variants={fadeUp}>
                <Link
                  to={`/services/${slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-5 border border-black/5 shadow-card hover:shadow-cardHover hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="h-12 w-12 rounded-full bg-offwhite flex items-center justify-center group-hover:bg-gold transition-colors duration-300">
                    <Icon className="h-5 w-5 text-black/70 group-hover:text-black transition-colors duration-300" />
                  </div>
                  <span className="text-xs md:text-sm font-medium text-center text-black/80">{name}</span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
