import { motion } from 'framer-motion'
import { staggerContainer, fadeUp } from '../../animations/variants'
import PrimaryButton from '../common/PrimaryButton'

export default function Hero({ settings }) {
  const {
    hero_subtitle = 'NO.1 EVENT MANAGEMENT',
    hero_title = 'SHIVAM EVENTS',
    hero_description = 'DJ EVENTS | PAPER BLAST | STAGE DECORATION\nAND MORE FOR ALL YOUR SPECIAL MOMENTS',
    hero_image,
    whatsapp,
  } = settings || {}

  return (
    <section className="relative min-h-[92vh] md:min-h-[88vh] flex items-center overflow-hidden bg-black">
      <motion.div
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        className="absolute inset-0"
      >
        {hero_image ? (
          <img src={hero_image} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-black via-black-charcoal to-black" />
        )}
        <div className="absolute inset-0 bg-black/60" />
      </motion.div>

      <motion.div
        variants={staggerContainer(0.15, 0.1)}
        initial="hidden"
        animate="visible"
        className="relative container-px mx-auto text-center max-w-3xl"
      >
        <motion.p variants={fadeUp} className="text-gold text-sm md:text-base font-semibold tracking-[0.2em] mb-4">
          {hero_subtitle}
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-tight"
        >
          {hero_title}
        </motion.h1>
        <motion.p variants={fadeUp} className="mt-6 text-white/80 text-sm md:text-base whitespace-pre-line leading-relaxed">
          {hero_description}
        </motion.p>
        <motion.p variants={fadeUp} className="mt-2 text-gold-light font-heading italic text-lg md:text-xl">
          Make Your Event Memorable
        </motion.p>

        <motion.div variants={fadeUp} className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <PrimaryButton as="link" to="/book" variant="gold">
            Book Events
          </PrimaryButton>
          {whatsapp && (
            <PrimaryButton
              as="a"
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              className="!border-white !text-white hover:!bg-white hover:!text-black"
            >
              WhatsApp Us
            </PrimaryButton>
          )}
        </motion.div>
      </motion.div>
    </section>
  )
}
