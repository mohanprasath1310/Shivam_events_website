import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { fadeUp, staggerContainer } from '../../animations/variants'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import EmptyState from '../../components/common/EmptyState'
import PrimaryButton from '../../components/common/PrimaryButton'

export default function ServiceDetail() {
  const { slug } = useParams()
  const [service, setService] = useState(undefined)
  const [images, setImages] = useState([])

  useEffect(() => {
    setService(undefined)
    supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()
      .then(async ({ data, error }) => {
        if (error) console.warn(error.message)
        setService(data || null)
        if (data) {
          const { data: imgs } = await supabase
            .from('service_images')
            .select('*')
            .eq('service_id', data.id)
            .order('display_order', { ascending: true })
          setImages(imgs || [])
        }
      })
  }, [slug])

  if (service === undefined) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    )
  }

  if (service === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <EmptyState title="Service not found" description="This service may have been removed or renamed." />
        <Link to="/services" className="text-gold-dark text-sm font-medium mt-2 underline">
          Back to Services
        </Link>
      </div>
    )
  }

  const gallery = [service.cover_image, ...images.map((i) => i.image_url)].filter(Boolean)

  return (
    <div className="pt-10 pb-28">
      <div className="container-px mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="font-heading text-3xl md:text-5xl font-bold">{service.name}</h1>
        </motion.div>

        {gallery.length > 0 && (
          <motion.div
            variants={staggerContainer(0.08)}
            initial="hidden"
            animate="visible"
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <motion.div variants={fadeUp} className="md:col-span-2 aspect-video md:aspect-auto md:h-[420px] rounded-2xl overflow-hidden bg-offwhite">
              <img src={gallery[0]} alt={service.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {gallery.slice(1, 3).map((src, i) => (
                <motion.div key={i} variants={fadeUp} className="aspect-video md:h-[200px] rounded-2xl overflow-hidden bg-offwhite">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-xl font-semibold">About this service</h2>
            <p className="mt-3 text-black/65 leading-relaxed whitespace-pre-line">{service.description}</p>

            {service.features?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-heading text-lg font-semibold">Included Features</h3>
                <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-black/70">
                      <Check className="h-4 w-4 text-gold-dark shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="h-fit rounded-2xl border border-black/10 p-6 sticky top-24"
          >
            <p className="text-sm text-black/50">Starting Price</p>
            <div className="mt-1 flex items-baseline gap-2">
              {service.offer_price && service.offer_price < service.price && (
                <span className="text-black/40 line-through text-sm">₹{service.price}</span>
              )}
              <span className="text-3xl font-bold text-gold-dark font-heading">
                ₹{service.offer_price || service.price}
              </span>
            </div>
            <PrimaryButton
              as="link"
              to={`/book?service=${encodeURIComponent(service.name)}`}
              className="w-full mt-6"
            >
              Book This Service
            </PrimaryButton>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
