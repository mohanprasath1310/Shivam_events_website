import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MapPin, Instagram, Clock, CheckCircle2 } from 'lucide-react'
import { fadeUp, slideRight, scaleIn } from '../../animations/variants'
import { supabase } from '../../lib/supabase'
import { FormField, Input, Textarea } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'

const EMPTY = { name: '', phone: '', email: '', message: '' }

export default function Contact() {
  const { settings } = useOutletContext()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number'
    if (!form.message.trim()) next.message = 'Please add a short message'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      message: form.message,
      status: 'New',
    }

    const { error } = await supabase.from('contact_messages').insert([payload])

    // Fire-and-forget email notification — failure here shouldn't block the
    // customer's success screen since the message is already saved.
    supabase.functions.invoke('send-notification', {
      body: { type: 'contact', ...payload },
    }).catch(() => {})

    setSubmitting(false)
    if (error) {
      console.warn(error.message)
      return
    }
    setSuccess(true)
    setForm(EMPTY)
  }

  return (
    <div className="pt-10 pb-28">
      <div className="container-px mx-auto">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center max-w-2xl mx-auto">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Contact Us</h1>
          <p className="mt-3 text-black/60">Get in Touch for Your Next Event</p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div variants={slideRight} initial="hidden" animate="visible" className="space-y-5">
            {(settings.phone_1 || settings.phone_2) && (
              <div className="flex items-start gap-4 rounded-2xl border border-black/10 p-5">
                <Phone className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Phone</p>
                  <p className="text-sm text-black/60 mt-1">{settings.phone_1}</p>
                  {settings.phone_2 && <p className="text-sm text-black/60">{settings.phone_2}</p>}
                </div>
              </div>
            )}
            {settings.address && (
              <div className="flex items-start gap-4 rounded-2xl border border-black/10 p-5">
                <MapPin className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Location</p>
                  <p className="text-sm text-black/60 mt-1">{settings.address}</p>
                </div>
              </div>
            )}
            {(settings.instagram || settings.instagram_2) && (
              <div className="flex items-start gap-4 rounded-2xl border border-black/10 p-5">
                <Instagram className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Instagram</p>
                  {settings.instagram && <p className="text-sm text-black/60 mt-1">@{settings.instagram}</p>}
                  {settings.instagram_2 && <p className="text-sm text-black/60">@{settings.instagram_2}</p>}
                </div>
              </div>
            )}
            {settings.working_hours && (
              <div className="flex items-start gap-4 rounded-2xl border border-black/10 p-5">
                <Clock className="h-5 w-5 text-gold-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Working Hours</p>
                  <p className="text-sm text-black/60 mt-1">{settings.working_hours}</p>
                </div>
              </div>
            )}

            {settings.google_maps_url && (
              <div className="rounded-2xl overflow-hidden border border-black/10 h-64">
                <iframe
                  src={settings.google_maps_url}
                  className="w-full h-full"
                  loading="lazy"
                  title="Location map"
                />
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl border border-black/10 p-6 md:p-8 relative overflow-hidden">
            <AnimatePresence>
              {success && (
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center text-center p-8"
                >
                  <CheckCircle2 className="h-12 w-12 text-gold-dark" />
                  <h3 className="font-heading text-xl font-semibold mt-4">Message Sent!</h3>
                  <p className="text-sm text-black/60 mt-2">We'll get back to you shortly.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="text-sm text-gold-dark font-medium mt-5 underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormField label="Name" error={errors.name}>
                <Input value={form.name} onChange={update('name')} placeholder="Your full name" />
              </FormField>
              <FormField label="Phone Number" error={errors.phone}>
                <Input value={form.phone} onChange={update('phone')} placeholder="10-digit mobile number" />
              </FormField>
              <FormField label="Email (Optional)">
                <Input type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" />
              </FormField>
              <FormField label="Message" error={errors.message}>
                <Textarea rows={4} value={form.message} onChange={update('message')} placeholder="How can we help?" />
              </FormField>

              <PrimaryButton type="submit" loading={submitting} className="w-full">
                Send Message
              </PrimaryButton>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
