import { motion } from 'framer-motion'
import { Play } from 'lucide-react'

export default function VideoCard({ video, onClick }) {
  const { title, category, thumbnail_url } = video

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      onClick={onClick}
      className="group text-left rounded-2xl overflow-hidden bg-white border border-black/5 shadow-card hover:shadow-cardHover transition-shadow duration-300"
    >
      <div className="relative h-44 overflow-hidden bg-black">
        {thumbnail_url && (
          <img
            src={thumbnail_url}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="h-11 w-11 rounded-full bg-gold flex items-center justify-center"
          >
            <Play className="h-4 w-4 text-black ml-0.5" fill="black" />
          </motion.div>
        </div>
      </div>
      <div className="p-4">
        <h4 className="font-medium text-sm text-black line-clamp-1">{title}</h4>
        {category && <p className="text-xs text-black/45 mt-1">{category}</p>}
      </div>
    </motion.button>
  )
}
