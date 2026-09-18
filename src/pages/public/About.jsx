import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, viewportOnce } from '../../animations/variants'
import StatsCounter from '../../components/home/StatsCounter'
import WhyChooseUs from '../../components/home/WhyChooseUs'
import PrimaryButton from '../../components/common/PrimaryButton'

export default function About() {
  const { settings } = useOutletContext()

  return (
    <div className="pt-10">
      <div className="container-px mx-auto">
        <motion.div
          variants={staggerContainer(0.12)}
          initial="hidden"
          animate="visible"
          className="max-w-2xl mx-auto text-center"
        >
          <motion.h1 variants={fadeUp} className="font-heading text-4xl md:text-5xl font-bold">
            About {settings.business_name}
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-5 text-black/65 leading-relaxed">
            {settings.business_name} has been bringing celebrations to life across Karur — from
            intimate birthdays to large weddings, college fests, and everything in between. Every
            event is planned with care, backed by a professional team, quality equipment, and a
            genuine commitment to making your day memorable.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8">
            <PrimaryButton as="link" to="/book">
              Book Your Event
            </PrimaryButton>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-16">
        <StatsCounter settings={settings} />
      </div>
      <WhyChooseUs />
    </div>
  )
}
