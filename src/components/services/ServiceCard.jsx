import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fadeUp } from '../../animations/variants'

export default function ServiceCard({ service }) {
  const { name, slug, short_description, cover_image, price, offer_price } = service

  return (
    <motion.div variants={fadeUp} className="group h-full">
      <Link
        to={`/services/${slug}`}
        className="flex flex-col h-full rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-black/5 shadow-card hover:shadow-cardHover hover:-translate-y-1.5 transition-all duration-300"
      >
        <div className="h-28 sm:h-40 lg:h-52 overflow-hidden bg-offwhite">
          {cover_image ? (
            <img
              src={cover_image}
              alt={name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-offwhite to-white" />
          )}
        </div>
        <div className="p-3 sm:p-4 lg:p-5 flex-1 flex flex-col">
          <h3 className="font-heading text-sm sm:text-base lg:text-lg font-semibold text-black line-clamp-1">{name}</h3>
          {short_description && (
            <p className="mt-1 sm:mt-1.5 text-xs sm:text-sm text-black/55 line-clamp-2">{short_description}</p>
          )}
          <div className="mt-2 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-0">
            <div className="min-w-0">
              {offer_price && offer_price < price && (
                <span className="text-[10px] sm:text-xs text-black/40 line-through mr-1.5 sm:mr-2">₹{price}</span>
              )}
              <span className="text-gold-dark font-semibold text-xs sm:text-sm whitespace-nowrap">
                From ₹{offer_price || price}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-black underline decoration-gold underline-offset-4 group-hover:decoration-2 transition-all">
              View Details
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
