import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { staggerContainer, fadeUp, viewportOnce } from '../../animations/variants'
import ServiceCard from '../../components/services/ServiceCard'
import { SkeletonGrid } from '../../components/common/SkeletonLoader'
import EmptyState from '../../components/common/EmptyState'

export default function Services() {
  const [services, setServices] = useState(null)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setServices(data || [])
      })
  }, [])

  return (
    <div className="pt-14 pb-24 md:pt-16 md:pb-24">
      <div className="container-px mx-auto pt-10">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Our Services</h1>
          <p className="mt-3 text-black/60">Everything You Need for a Perfect Celebration</p>
        </motion.div>

        <div className="mt-14">
          {services === null ? (
            <SkeletonGrid count={6} />
          ) : services.length === 0 ? (
            <EmptyState title="No services yet" description="Services will appear here once added in the admin panel." />
          ) : (
            <motion.div
              variants={staggerContainer(0.08)}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6"
            >
              {services.map((s) => (
                <ServiceCard key={s.id} service={s} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
