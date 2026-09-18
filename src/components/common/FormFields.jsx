import { motion, AnimatePresence } from 'framer-motion'

export function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-black/70 mb-1.5">{label}</label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            className="text-xs text-red-500 mt-1"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-black/15 px-4 py-3 text-base sm:text-sm outline-none transition-colors duration-200 focus:border-gold placeholder:text-black/30 ${props.className || ''}`}
    />
  )
}

export function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-black/15 px-4 py-3 text-base sm:text-sm outline-none transition-colors duration-200 focus:border-gold placeholder:text-black/30 resize-none ${props.className || ''}`}
    />
  )
}

export function Select(props) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-black/15 px-4 py-3 text-base sm:text-sm outline-none transition-colors duration-200 focus:border-gold bg-white ${props.className || ''}`}
    />
  )
}
