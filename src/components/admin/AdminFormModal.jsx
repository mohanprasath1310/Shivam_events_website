import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'

export default function AdminFormModal({ open, title, onClose, children, wide = false }) {
  // See AdminHeader's drawer for why this two-flag (mounted vs open) pattern
  // exists: closing this modal usually happens in the same instant the list
  // behind it refetches and re-renders (Save -> close + reload), which can
  // interrupt the fade-out animation and strand an invisible, click-blocking
  // overlay on screen. `pointerEvents` below is tied directly to `open`, not
  // to whether the animation finished, so that can no longer happen.
  const [mounted, setMounted] = useState(false)

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 z-[90] bg-black/50 flex items-start md:items-center justify-center p-3 sm:p-4"
      style={{ height: '100dvh', pointerEvents: open ? 'auto' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      onAnimationComplete={() => {
        if (!open) setMounted(false)
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${wide ? 'max-w-2xl' : 'max-w-md'} bg-white rounded-2xl p-4 sm:p-6 my-4 sm:my-8 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain`}
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-heading text-lg font-semibold">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="h-9 w-9 -mr-1.5 flex items-center justify-center text-black/40 hover:text-black transition-colors touch-manipulation"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  )
}
