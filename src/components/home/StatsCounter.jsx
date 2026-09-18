import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useCountUp } from '../../hooks/useCountUp'
import { staggerContainer, fadeUp } from '../../animations/variants'

function Stat({ end, suffix, label, start }) {
  const value = useCountUp(end, { start })
  return (
    <motion.div variants={fadeUp} className="text-center">
      <p className="font-heading text-4xl md:text-5xl font-bold text-gold">
        {value}
        {suffix}
      </p>
      <p className="mt-2 text-white/70 text-sm md:text-base">{label}</p>
    </motion.div>
  )
}

export default function StatsCounter({ settings }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })

  const { happy_events = 500, happy_clients = 100, years_experience = 5 } = settings || {}

  return (
    <section ref={ref} className="py-16 md:py-20 bg-black">
      <motion.div
        variants={staggerContainer(0.15)}
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        className="container-px mx-auto grid grid-cols-3 gap-6"
      >
        <Stat end={happy_events} suffix="+" label="Happy Events" start={inView} />
        <Stat end={happy_clients} suffix="%" label="Happy Clients" start={inView} />
        <Stat end={years_experience} suffix="+" label="Years Experience" start={inView} />
      </motion.div>
    </section>
  )
}
