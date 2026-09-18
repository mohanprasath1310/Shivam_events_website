import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fadeUp } from '../../animations/variants'
import GalleryCard from '../../components/home/GalleryCard'
import Lightbox from '../../components/common/Lightbox'
import VideoModal from '../../components/common/VideoModal'
import { SkeletonGrid } from '../../components/common/SkeletonLoader'
import EmptyState from '../../components/common/EmptyState'

const CATEGORIES = ['All', 'DJ Events', 'Paper Blast', 'Decoration']

export default function Gallery() {
  const [items, setItems] = useState(null)
  const [category, setCategory] = useState('All')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setItems(data || [])
      })
  }, [])

  const filtered = useMemo(() => {
    if (!items) return []
    return category === 'All' ? items : items.filter((i) => i.category === category)
  }, [items, category])

  const images = filtered.filter((i) => i.media_type !== 'video')

  const handleClick = (item) => {
    if (item.media_type === 'video') {
      setActiveVideo({ video_type: 'uploaded', video_url: item.media_url, title: item.title })
    } else {
      setLightboxIndex(images.findIndex((i) => i.id === item.id))
    }
  }

  return (
    <div className="pt-10 pb-28">
      <div className="container-px mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Gallery</h1>
          <p className="mt-3 text-black/60">Memorable Moments</p>
        </motion.div>

        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300"
            >
              {category === cat && (
                <motion.span
                  layoutId="gallery-filter-pill"
                  className="absolute inset-0 bg-black rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${category === cat ? 'text-white' : 'text-black/60'}`}>{cat}</span>
            </button>
          ))}
        </div>

        <div className="mt-10">
          {items === null ? (
            <SkeletonGrid count={8} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No items in this category" description="Try a different category or check back soon." />
          ) : (
            <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              <AnimatePresence>
                {filtered.map((item) => (
                  <GalleryCard key={item.id} item={item} onClick={() => handleClick(item)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <Lightbox items={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)} onNavigate={setLightboxIndex} />
      <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </div>
  )
}
