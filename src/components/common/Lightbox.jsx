import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import { backdropVariants, modalVariants } from '../../animations/variants'

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const open = index !== null && index !== undefined
  const item = open ? items[index] : null

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, index, items, onClose, onNavigate])

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
            aria-label="Close"
            className="absolute top-5 right-5 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          {items.length > 1 && (
            <>
              <button
                aria-label="Previous"
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate((index - 1 + items.length) % items.length)
                }}
                className="absolute left-3 md:left-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                aria-label="Next"
                onClick={(e) => {
                  e.stopPropagation()
                  onNavigate((index + 1) % items.length)
                }}
                className="absolute right-3 md:right-6 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl max-h-[85vh] w-full"
          >
            <img
              src={item.media_url}
              alt={item.title || ''}
              className="w-full h-full max-h-[85vh] object-contain rounded-lg"
            />
            {item.title && <p className="text-white/70 text-sm text-center mt-3">{item.title}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
