import { motion } from 'framer-motion'
import { fadeUp, viewportOnce } from '../../animations/variants'
import PrimaryButton from '../common/PrimaryButton'

export default function CTASection() {
  return (
    <section className="relative py-20 md:py-28 bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-black via-black-charcoal to-black"
      />
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="relative container-px mx-auto text-center max-w-xl"
      >
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
          Ready to Make Your Event Memorable?
        </h2>
        <div className="mt-8">
          <PrimaryButton as="link" to="/book" variant="gold">
            Book Your Event Now
          </PrimaryButton>
        </div>
      </motion.div>
    </section>
  )
}
