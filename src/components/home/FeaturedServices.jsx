import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { staggerContainer, viewportOnce } from '../../animations/variants'
import SectionHeading from '../common/SectionHeading'
import ServiceCard from '../services/ServiceCard'
import PrimaryButton from '../common/PrimaryButton'
import { SkeletonGrid } from '../common/SkeletonLoader'
import EmptyState from '../common/EmptyState'

export default function FeaturedServices() {
  const [services, setServices] = useState(null)

  useEffect(() => {
    supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setServices(data || [])
      })
  }, [])

  return (
    <section className="py-16 md:py-24 bg-offwhite">
      <div className="container-px mx-auto">
        <SectionHeading title="Featured Services" subtitle="Popular choices for your celebration" />

        {services === null ? (
          <SkeletonGrid count={3} />
        ) : services.length === 0 ? (
          <EmptyState title="Services coming soon" description="Featured services will appear here once added in the admin panel." />
        ) : (
          <motion.div
            variants={staggerContainer(0.1)}
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

        <div className="text-center mt-10">
          <PrimaryButton as="link" to="/services" variant="dark">
            View All Services
          </PrimaryButton>
        </div>
      </div>
    </section>
  )
}
