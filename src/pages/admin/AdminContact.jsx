import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fadeUp } from '../../animations/variants'
import { FormField, Input, Textarea } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminContact() {
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message)
        setForm(data || {})
      })
  }, [])

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      phone_1: form.phone_1,
      phone_2: form.phone_2,
      whatsapp: form.whatsapp,
      email: form.email,
      address: form.address,
      instagram: form.instagram,
      youtube: form.youtube,
      facebook: form.facebook,
      google_maps_url: form.google_maps_url,
      working_hours: form.working_hours,
    }

    const query = form.id
      ? supabase.from('website_settings').update(payload).eq('id', form.id)
      : supabase.from('website_settings').insert([payload]).select().single()

    const { data, error } = await query
    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }
    if (data && !form.id) setForm(data)
    toast.success('Contact details updated')
  }

  if (form === null) {
    return <div className="py-20 flex justify-center"><LoadingSpinner size={28} /></div>
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Contact Details</h1>
      <p className="text-sm text-black/50 mt-1">Update phone, WhatsApp, social links, and address shown site-wide</p>

      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        onSubmit={handleSave}
        className="mt-6 max-w-2xl space-y-5 rounded-2xl border border-black/10 bg-white p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Primary Phone">
            <Input value={form.phone_1 || ''} onChange={update('phone_1')} />
          </FormField>
          <FormField label="Secondary Phone">
            <Input value={form.phone_2 || ''} onChange={update('phone_2')} />
          </FormField>
        </div>

        <FormField label="WhatsApp Number (with country code, no +)">
          <Input value={form.whatsapp || ''} onChange={update('whatsapp')} placeholder="917603877178" />
        </FormField>

        <FormField label="Email">
          <Input type="email" value={form.email || ''} onChange={update('email')} />
        </FormField>

        <FormField label="Address">
          <Textarea rows={2} value={form.address || ''} onChange={update('address')} />
        </FormField>

        <FormField label="Working Hours">
          <Input value={form.working_hours || ''} onChange={update('working_hours')} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="Instagram (username)">
            <Input value={form.instagram || ''} onChange={update('instagram')} />
          </FormField>
          <FormField label="YouTube URL">
            <Input value={form.youtube || ''} onChange={update('youtube')} />
          </FormField>
          <FormField label="Facebook URL">
            <Input value={form.facebook || ''} onChange={update('facebook')} />
          </FormField>
        </div>

        <FormField label="Google Maps Embed URL">
          <Input value={form.google_maps_url || ''} onChange={update('google_maps_url')} placeholder="https://www.google.com/maps/embed?..." />
        </FormField>

        <PrimaryButton type="submit" loading={saving}>
          Save Changes
        </PrimaryButton>
      </motion.form>
    </div>
  )
}
