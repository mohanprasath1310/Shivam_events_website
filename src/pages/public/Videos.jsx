import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fadeUp } from '../../animations/variants'
import VideoCard from '../../components/home/VideoCard'
import VideoModal from '../../components/common/VideoModal'
import { SkeletonGrid } from '../../components/common/SkeletonLoader'
import EmptyState from '../../components/common/EmptyState'

const CATEGORIES = ['All', 'DJ Events', 'Paper Blast', 'Decoration']

export default function Videos() {
  const [videos, setVideos] = useState(null)
  const [category, setCategory] = useState('All')
  const [active, setActive] = useState(null)

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .order('display_order', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setVideos(data || [])
      })
  }, [])

  const filtered = useMemo(() => {
    if (!videos) return []
    return category === 'All' ? videos : videos.filter((v) => v.category === category)
  }, [videos, category])

  return (
    <div className="pt-10 pb-28">
      <div className="container-px mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Event Videos</h1>
          <p className="mt-3 text-black/60">Watch Our Celebrations</p>
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
                  layoutId="video-filter-pill"
                  className="absolute inset-0 bg-black rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className={`relative z-10 ${category === cat ? 'text-white' : 'text-black/60'}`}>{cat}</span>
            </button>
          ))}
        </div>

        <div className="mt-10">
          {videos === null ? (
            <SkeletonGrid count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No videos in this category" description="Try a different category or check back soon." />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filtered.map((v) => (
                  <VideoCard key={v.id} video={v} onClick={() => setActive(v)} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </div>
  )
}
