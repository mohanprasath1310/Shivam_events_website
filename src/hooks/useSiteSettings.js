import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const FALLBACK = {
  business_name: 'Shivam Events',
  logo_url: null,
  hero_title: 'SHIVAM EVENTS',
  hero_subtitle: 'NO.1 EVENT MANAGEMENT',
  hero_description: 'DJ EVENTS | PAPER BLAST | DECORATION',
  hero_image: null,
  hero_video: null,
  phone_1: '7603877178',
  phone_2: '6384323364',
  whatsapp: '916384323364',
  email: '',
  address: 'Moodimangalam, Karur',
  instagram: 'no.1_shivam_events',
  instagram_2: 'no.1_shivam_paper_blast',
  youtube: '',
  facebook: '',
  google_maps_url: '',
  working_hours: 'Mon - Sun: 9:00 AM - 10:00 PM',
  happy_events: 500,
  happy_clients: 100,
  years_experience: 5,
}

// Single-row settings table; falls back to sensible defaults so the site
// still renders (with a console warning) before Supabase is fully seeded.
export function useSiteSettings() {
  const [settings, setSettings] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from('website_settings')
      .select('*')
      .limit(1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!active) return
        if (error) {
          // eslint-disable-next-line no-console
          console.warn('Falling back to default site settings:', error.message)
        }
        if (data) setSettings({ ...FALLBACK, ...data })
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { settings, loading }
}
