import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function GalleryCard({ item, onClick }) {
  const { title, thumbnail_url, media_url, media_type, category } = item
  const src = thumbnail_url || media_url

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-xl bg-offwhite text-left"
    >
      {src && (
        <img
          src={src}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
        {media_type === 'video' && (
          <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
            <Play className="h-4 w-4 text-black ml-0.5" fill="black" />
          </div>
        )}
      </div>
      {category && (
        <span className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/60 text-white px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {category}
        </span>
      )}
    </motion.button>
  )
}
