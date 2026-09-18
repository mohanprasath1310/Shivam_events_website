import { motion } from 'framer-motion'

export default function WhatsAppButton({ number }) {
  if (!number) return null

  const message = encodeURIComponent(
    'Hello Shivam Events, I would like to know more about your event services.'
  )
  const href = `https://wa.me/${number}?text=${message}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-24 md:bottom-6 z-40 h-14 w-14 rounded-full bg-[#25D366] shadow-cardHover flex items-center justify-center"
      // bottom-24 on mobile keeps it clear of the fixed bottom nav bar
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-white">
        <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.386.699 4.61 1.902 6.484L4 29l7.72-1.867A11.94 11.94 0 0 0 16.001 27C22.629 27 28 21.627 28 15S22.629 3 16.001 3zm6.994 16.66c-.29.816-1.68 1.567-2.34 1.664-.598.088-1.355.125-2.187-.137-.504-.16-1.151-.373-1.982-.732-3.487-1.505-5.767-4.986-5.943-5.219-.176-.234-1.427-1.9-1.427-3.625s.907-2.574 1.229-2.926c.322-.351.703-.44.937-.44.234 0 .469.002.674.012.216.01.505-.082.79.603.29.703.985 2.428 1.072 2.605.088.176.146.38.03.615-.117.234-.176.38-.351.585-.176.205-.37.457-.527.615-.176.176-.36.366-.155.72.205.351.913 1.507 1.96 2.44 1.347 1.2 2.483 1.572 2.835 1.748.351.176.556.146.762-.088.205-.234.878-1.024 1.112-1.376.234-.351.469-.293.79-.176.322.117 2.043.964 2.394 1.14.351.176.585.264.673.41.088.146.088.85-.201 1.666z" />
      </svg>
    </motion.a>
  )
}
