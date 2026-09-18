import { motion } from 'framer-motion'
import { Users, Wrench, Lightbulb, Clock, ThumbsUp } from 'lucide-react'
import { staggerContainer, fadeUp, viewportOnce } from '../../animations/variants'
import SectionHeading from '../common/SectionHeading'

const FEATURES = [
  { title: 'Professional Team', desc: 'Experienced event specialists managing every detail.', icon: Users },
  { title: 'Quality Equipment', desc: 'Premium sound, lighting, and decor equipment.', icon: Wrench },
  { title: 'Creative Ideas', desc: 'Fresh, personalized concepts for every occasion.', icon: Lightbulb },
  { title: 'On-Time Service', desc: 'Punctual setup and reliable event-day execution.', icon: Clock },
  { title: 'Customer Satisfaction', desc: 'Hundreds of happy clients across Karur and beyond.', icon: ThumbsUp },
]

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-px mx-auto">
        <SectionHeading title="Why Choose Shivam Events" subtitle="What sets our celebrations apart" />

        {/* First row: 3 cards */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-3 lg:grid-cols-5 gap-4"
        >
          {FEATURES.slice(0, 3).map(({ title, desc, icon: Icon }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-black/5 p-6 text-center hover:shadow-card transition-shadow duration-300"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-black flex items-center justify-center">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 font-semibold text-black">{title}</h3>
              <p className="mt-2 text-sm text-black/55 leading-relaxed">{desc}</p>
            </motion.div>
          ))}

          {/* On desktop show last 2 in same row */}
          {FEATURES.slice(3).map(({ title, desc, icon: Icon }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="hidden lg:block rounded-2xl border border-black/5 p-6 text-center hover:shadow-card transition-shadow duration-300"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-black flex items-center justify-center">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 font-semibold text-black">{title}</h3>
              <p className="mt-2 text-sm text-black/55 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile only: last 2 cards centered on second row */}
        <motion.div
          variants={staggerContainer(0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:hidden grid grid-cols-2 gap-4 mt-4 w-2/3 mx-auto"
        >
          {FEATURES.slice(3).map(({ title, desc, icon: Icon }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              className="rounded-2xl border border-black/5 p-6 text-center hover:shadow-card transition-shadow duration-300"
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-black flex items-center justify-center">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 font-semibold text-black">{title}</h3>
              <p className="mt-2 text-sm text-black/55 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}