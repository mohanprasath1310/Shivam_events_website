import { Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

export default function QuantitySelector({ label = 'Number of Shots', value, onChange, min = 1, max = 50 }) {
  const dec = () => onChange(Math.max(min, value - 1))
  const inc = () => onChange(Math.min(max, value + 1))

  return (
    <div>
      <label className="block text-sm font-medium text-black/70 mb-2">{label}</label>
      <div className="inline-flex items-center rounded-full border border-black/15 overflow-hidden">
        <button
          type="button"
          onClick={dec}
          disabled={value <= min}
          className="h-11 w-11 flex items-center justify-center hover:bg-offwhite disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <motion.span
          key={value}
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.15 }}
          className="w-14 text-center font-semibold font-heading text-lg"
        >
          {value}
        </motion.span>
        <button
          type="button"
          onClick={inc}
          disabled={value >= max}
          className="h-11 w-11 flex items-center justify-center hover:bg-offwhite disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-black/40 mt-1.5">Min {min}, max {max} shots</p>
    </div>
  )
}
