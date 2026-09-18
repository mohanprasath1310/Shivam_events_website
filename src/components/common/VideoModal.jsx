import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { backdropVariants, modalVariants } from '../../animations/variants'

function getYouTubeEmbed(url) {
  const match = url?.match(/(?:youtu\.be\/|v=|embed\/)([\w-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url
}

export default function VideoModal({ video, onClose }) {
  const open = !!video

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Close video"
            className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl aspect-video rounded-xl overflow-hidden bg-black"
          >
            {video?.video_type === 'youtube' ? (
              <iframe
                src={getYouTubeEmbed(video.video_url)}
                title={video.title}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
              />
            ) : video?.video_type === 'instagram' ? (
              <iframe
                src={`${video.video_url}embed`}
                title={video.title}
                className="w-full h-full"
                allowFullScreen
              />
            ) : (
              <video src={video?.video_url} controls autoPlay className="w-full h-full" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
