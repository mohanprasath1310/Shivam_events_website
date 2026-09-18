import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../../animations/variants'

export default function SectionHeading({ title, subtitle, align = 'center', dark = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left'}`}
    >
      <h2 className={`text-3xl md:text-4xl font-bold ${dark ? 'text-white' : 'text-black'}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base md:text-lg ${dark ? 'text-white/70' : 'text-black/60'}`}>
          {subtitle}
        </p>
      )}
      <div className={`mt-4 h-[3px] w-14 bg-gold rounded-full ${align === 'center' ? 'mx-auto' : ''}`} />
    </motion.div>
  )
}
