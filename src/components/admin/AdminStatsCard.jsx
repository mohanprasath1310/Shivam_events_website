import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/variants'

export default function AdminStatsCard({ label, value, icon: Icon }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-black/10 p-5 flex items-center gap-4"
    >
      <div className="h-11 w-11 rounded-xl bg-black flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <div>
        <p className="text-2xl font-bold font-heading">{value}</p>
        <p className="text-xs text-black/50 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
