import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, User, CalendarDays, ListChecks, MessageSquare } from 'lucide-react'
import { fadeUp, staggerContainer, scaleIn } from '../../animations/variants'
import { supabase } from '../../lib/supabase'
import { FormField, Input, Textarea, Select } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'

const EVENT_TYPES = ['DJ Event', 'Paper Blast', 'Birthday', 'Wedding', 'College Event', 'Function', 'Other']

const ADDON_OPTIONS = [
  'Paper Blast',
  'DJ',
  'Decoration',
  'Stage Decoration',
  'Original Flower Decoration',
  'Other',
]

const EMPTY = {
  customer_name: '',
  phone: '',
  event_type: '',
  event_date: '',
  event_time: '',
  location: '',
  expected_budget: '',
  addons: [],
  addon_other: '',
  special_requirements: '',
}

function SectionCard({ icon: Icon, title, children }) {
  return (
    <motion.div variants={fadeUp} className="rounded-2xl border border-black/10 p-5 md:p-6 bg-white">
      <div className="flex items-center gap-2.5 mb-5">
        <div className="h-8 w-8 rounded-lg bg-black flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4 text-gold" />
        </div>
        <h2 className="font-heading font-semibold text-black">{title}</h2>
      </div>
      <div className="space-y-4">{children}</div>
    </motion.div>
  )
}

export default function Booking() {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const toggleAddon = (addon) => {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(addon) ? f.addons.filter((a) => a !== addon) : [...f.addons, addon],
    }))
  }

  const validate = () => {
    const next = {}
    if (!form.customer_name.trim()) next.customer_name = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit phone number'
    if (!form.event_type) next.event_type = 'Select an event type'
    if (!form.event_date) next.event_date = 'Select an event date'
    if (!form.event_time) next.event_time = 'Select an event time'
    if (!form.location.trim()) next.location = 'Event location is required'
    if (!form.expected_budget.trim()) next.expected_budget = 'Enter your expected budget'
    if (form.addons.includes('Other') && !form.addon_other.trim()) {
      next.addon_other = 'Please describe the custom requirement'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      customer_name: form.customer_name,
      phone: form.phone,
      event_type: form.event_type,
      event_date: form.event_date,
      event_time: form.event_time,
      location: form.location,
      budget: form.expected_budget,
      expected_budget: isNaN(Number(form.expected_budget)) ? null : Number(form.expected_budget),
      addons: form.addons,
      addon_other: form.addons.includes('Other') ? form.addon_other : null,
      special_requirements: form.special_requirements || null,
      status: 'New',
    }

    const { error } = await supabase.from('bookings').insert([payload])

    // Fire-and-forget email notification — failure here shouldn't block the
    // customer's confirmation screen since the booking is already saved.
    supabase.functions.invoke('send-notification', {
      body: { type: 'booking', ...payload },
    }).catch(() => {})

    setSubmitting(false)
    if (error) {
      console.warn(error.message)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="pt-10 pb-28">
        <div className="container-px mx-auto max-w-lg">
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            className="rounded-2xl border border-black/10 p-8 md:p-10 text-center"
          >
            <CheckCircle2 className="h-14 w-14 text-emerald-500 mx-auto" />
            <h1 className="font-heading text-2xl font-bold mt-5">Thank You for Your Booking!</h1>
            <p className="text-black/60 mt-3">
              Our team will review your event requirements and contact you shortly to confirm the details.
            </p>
            <button
              onClick={() => {
                setForm(EMPTY)
                setSuccess(false)
              }}
              className="text-sm text-gold-dark font-medium mt-6 underline"
            >
              Book another event
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-10 pb-28">
      <div className="container-px mx-auto max-w-2xl">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold">Book Your Event</h1>
          <p className="mt-3 text-black/60">Tell us the details and we'll take it from there</p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          variants={staggerContainer(0.1)}
          initial="hidden"
          animate="visible"
          className="mt-10 space-y-5"
        >
          <SectionCard icon={User} title="Customer Details">
            <FormField label="Full Name" error={errors.customer_name}>
              <Input value={form.customer_name} onChange={update('customer_name')} placeholder="Your full name" />
            </FormField>
            <FormField label="Phone Number" error={errors.phone}>
              <Input value={form.phone} onChange={update('phone')} placeholder="10-digit mobile number" />
            </FormField>
          </SectionCard>

          <SectionCard icon={CalendarDays} title="Event Details">
            <FormField label="Event Type" error={errors.event_type}>
              <Select value={form.event_type} onChange={update('event_type')}>
                <option value="">Select event type</option>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
            </FormField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Event Date" error={errors.event_date}>
                <Input type="date" value={form.event_date} onChange={update('event_date')} />
              </FormField>
              <FormField label="Event Time" error={errors.event_time}>
                <Input type="time" value={form.event_time} onChange={update('event_time')} />
              </FormField>
            </div>

            <FormField label="Event Location" error={errors.location}>
              <Input value={form.location} onChange={update('location')} placeholder="Venue or area" />
            </FormField>

            <FormField label="Expected Budget" error={errors.expected_budget}>
              <Input value={form.expected_budget} onChange={update('expected_budget')} placeholder="e.g. ₹15,000 – ₹20,000" />
            </FormField>
          </SectionCard>

          <SectionCard icon={ListChecks} title="Needs / Add-ons">
            <p className="text-xs text-black/40 -mt-2 mb-1">Select any additional services you'd like</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {ADDON_OPTIONS.map((addon) => {
                const checked = form.addons.includes(addon)
                return (
                  <button
                    type="button"
                    key={addon}
                    onClick={() => toggleAddon(addon)}
                    className={`text-left px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      checked
                        ? 'bg-gold border-gold text-black'
                        : 'border-black/15 text-black/70 hover:border-black/30'
                    }`}
                  >
                    {addon}
                  </button>
                )
              })}
            </div>

            <AnimatePresence>
              {form.addons.includes('Other') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <FormField label="Describe your custom requirement" error={errors.addon_other}>
                    <Input
                      value={form.addon_other}
                      onChange={update('addon_other')}
                      placeholder="Tell us what else you need"
                    />
                  </FormField>
                </motion.div>
              )}
            </AnimatePresence>
          </SectionCard>

          <SectionCard icon={MessageSquare} title="Special Requirements">
            <Textarea
              rows={4}
              value={form.special_requirements}
              onChange={update('special_requirements')}
              placeholder="Anything specific we should know about your event"
            />
          </SectionCard>

          <PrimaryButton type="submit" loading={submitting} className="w-full">
            Submit Booking
          </PrimaryButton>
        </motion.form>
      </div>
    </div>
  )
}
