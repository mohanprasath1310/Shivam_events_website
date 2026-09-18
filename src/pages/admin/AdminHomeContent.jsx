import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fadeUp } from '../../animations/variants'
import { FormField, Input, Textarea } from '../../components/common/FormFields'
import ImageUploader from '../../components/admin/ImageUploader'
import PrimaryButton from '../../components/common/PrimaryButton'
import LoadingSpinner from '../../components/common/LoadingSpinner'

export default function AdminHomeContent() {
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
      business_name: form.business_name,
      logo_url: form.logo_url,
      hero_subtitle: form.hero_subtitle,
      hero_title: form.hero_title,
      hero_description: form.hero_description,
      hero_image: form.hero_image,
      happy_events: form.happy_events ? Number(form.happy_events) : null,
      happy_clients: form.happy_clients ? Number(form.happy_clients) : null,
      years_experience: form.years_experience ? Number(form.years_experience) : null,
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
    toast.success('Home content updated')
  }

  if (form === null) {
    return <div className="py-20 flex justify-center"><LoadingSpinner size={28} /></div>
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Home Page Content</h1>
      <p className="text-sm text-black/50 mt-1">Edit the hero section and stats shown on your homepage</p>

      <motion.form
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        onSubmit={handleSave}
        className="mt-6 max-w-2xl space-y-5 rounded-2xl border border-black/10 bg-white p-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageUploader bucket="settings" value={form.logo_url} onUploaded={(url) => setForm((f) => ({ ...f, logo_url: url }))} label="Logo" />
          <ImageUploader bucket="settings" value={form.hero_image} onUploaded={(url) => setForm((f) => ({ ...f, hero_image: url }))} label="Hero Background Image" />
        </div>

        <FormField label="Business Name">
          <Input value={form.business_name || ''} onChange={update('business_name')} />
        </FormField>

        <FormField label="Hero Subtitle (small text above title)">
          <Input value={form.hero_subtitle || ''} onChange={update('hero_subtitle')} placeholder="NO.1 EVENT MANAGEMENT" />
        </FormField>

        <FormField label="Hero Title">
          <Input value={form.hero_title || ''} onChange={update('hero_title')} />
        </FormField>

        <FormField label="Hero Description">
          <Textarea rows={3} value={form.hero_description || ''} onChange={update('hero_description')} />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <FormField label="Happy Events">
            <Input type="number" value={form.happy_events ?? ''} onChange={update('happy_events')} />
          </FormField>
          <FormField label="Happy Clients (%)">
            <Input type="number" value={form.happy_clients ?? ''} onChange={update('happy_clients')} />
          </FormField>
          <FormField label="Years Experience">
            <Input type="number" value={form.years_experience ?? ''} onChange={update('years_experience')} />
          </FormField>
        </div>

        <PrimaryButton type="submit" loading={saving}>
          Save Changes
        </PrimaryButton>
      </motion.form>
    </div>
  )
}
