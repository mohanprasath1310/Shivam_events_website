import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import useBodyScrollLock from '../../hooks/useBodyScrollLock'
import PrimaryButton from './PrimaryButton'

export default function ConfirmDeleteModal({
  open,
  title = 'Delete this item?',
  description = 'This action cannot be undone.',
  onCancel,
  onConfirm,
  loading = false,
}) {
  // See AdminHeader's drawer for why this two-flag (mounted vs open) pattern
  // exists: this modal typically closes right as the list behind it refetches
  // after a delete, which can interrupt the fade-out animation and strand an
  // invisible, click-blocking overlay on screen. pointerEvents is tied
  // directly to `open`, not to whether the animation finished.
  const [mounted, setMounted] = useState(false)

  useBodyScrollLock(open)

  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  if (!mounted) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      style={{ height: '100dvh', pointerEvents: open ? 'auto' : 'none' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      onAnimationComplete={() => {
        if (!open) setMounted(false)
      }}
      onClick={onCancel}
    >
      <motion.div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-cardHover max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
        style={{ WebkitOverflowScrolling: 'touch' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.97 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <h3 className="font-heading font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-sm text-black/60 mt-3">{description}</p>
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full border border-black/10 py-3 sm:py-2.5 text-sm font-medium hover:bg-offwhite transition-colors touch-manipulation"
          >
            Cancel
          </button>
          <PrimaryButton
            type="button"
            variant="dark"
            className="flex-1 !bg-red-500 hover:!bg-red-600"
            onClick={onConfirm}
            loading={loading}
          >
            Delete
          </PrimaryButton>
        </div>
      </motion.div>
    </motion.div>
  )
}
