import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { staggerContainer, viewportOnce } from '../../animations/variants'
import SectionHeading from '../common/SectionHeading'
import GalleryCard from './GalleryCard'
import PrimaryButton from '../common/PrimaryButton'
import Lightbox from '../common/Lightbox'

export default function FeaturedGallery() {
  const [items, setItems] = useState([])
  const [activeIndex, setActiveIndex] = useState(null)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(8)
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setItems(data || [])
      })
  }, [])

  if (items.length === 0) return null

  return (
    <section className="py-16 md:py-24">
      <div className="container-px mx-auto">
        <SectionHeading title="Featured Gallery" subtitle="A glimpse of moments we've created" />

        <motion.div
          variants={staggerContainer(0.06)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4"
        >
          {items.map((item, i) => (
            <GalleryCard key={item.id} item={item} onClick={() => setActiveIndex(i)} />
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <PrimaryButton as="link" to="/gallery" variant="dark">
            View Gallery
          </PrimaryButton>
        </div>
      </div>

      <Lightbox
        items={items}
        index={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </section>
  )
}
