import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { staggerContainer, viewportOnce } from '../../animations/variants'
import SectionHeading from '../common/SectionHeading'
import VideoCard from './VideoCard'
import VideoModal from '../common/VideoModal'
import PrimaryButton from '../common/PrimaryButton'

export default function FeaturedVideos() {
  const [videos, setVideos] = useState([])
  const [active, setActive] = useState(null)

  useEffect(() => {
    supabase
      .from('videos')
      .select('*')
      .eq('is_featured', true)
      .order('display_order', { ascending: true })
      .limit(6)
      .then(({ data, error }) => {
        if (error) console.warn(error.message)
        setVideos(data || [])
      })
  }, [])

  if (videos.length === 0) return null

  return (
    <section className="py-16 md:py-24 bg-offwhite">
      <div className="container-px mx-auto">
        <SectionHeading title="Featured Videos" subtitle="Watch our celebrations come alive" />

        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} onClick={() => setActive(v)} />
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <PrimaryButton as="link" to="/videos" variant="dark">
            View Videos
          </PrimaryButton>
        </div>
      </div>

      <VideoModal video={active} onClose={() => setActive(null)} />
    </section>
  )
}
