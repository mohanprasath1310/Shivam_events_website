import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarCheck, LayoutGrid, Image, Video, Mail, Bell } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { staggerContainer, fadeUp } from '../../animations/variants'
import AdminStatsCard from '../../components/admin/AdminStatsCard'
import DataTable from '../../components/admin/DataTable'

const QUICK_ACTIONS = [
  { to: '/admin/services', label: 'Manage Services' },
  { to: '/admin/gallery', label: 'Manage Gallery' },
  { to: '/admin/videos', label: 'Manage Videos' },
  { to: '/admin/messages', label: 'Manage Messages' },
]

export default function AdminDashboard() {
  const [counts, setCounts] = useState(null)
  const [recentBookings, setRecentBookings] = useState(null)

  useEffect(() => {
    const load = async () => {
      const [bookings, newBookings, services, gallery, videos, messages, recent] = await Promise.all([
        supabase.from('bookings').select('id', { count: 'exact', head: true }),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('status', 'New'),
        supabase.from('services').select('id', { count: 'exact', head: true }),
        supabase.from('gallery').select('id', { count: 'exact', head: true }),
        supabase.from('videos').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id', { count: 'exact', head: true }),
        supabase
          .from('bookings')
          .select('id, customer_name, event_type, event_date, status')
          .order('created_at', { ascending: false })
          .limit(5),
      ])

      setCounts({
        bookings: bookings.count ?? 0,
        newBookings: newBookings.count ?? 0,
        services: services.count ?? 0,
        gallery: gallery.count ?? 0,
        videos: videos.count ?? 0,
        messages: messages.count ?? 0,
      })
      setRecentBookings(recent.data || [])
    }
    load()
  }, [])

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
      <p className="text-sm text-black/50 mt-1">Overview of your website activity</p>

      <motion.div
        variants={staggerContainer(0.08)}
        initial="hidden"
        animate="visible"
        className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <AdminStatsCard label="Total Bookings" value={counts?.bookings ?? '—'} icon={CalendarCheck} />
        <AdminStatsCard label="New Booking Requests" value={counts?.newBookings ?? '—'} icon={Bell} />
        <AdminStatsCard label="Contact Messages" value={counts?.messages ?? '—'} icon={Mail} />
        <AdminStatsCard label="Total Services" value={counts?.services ?? '—'} icon={LayoutGrid} />
        <AdminStatsCard label="Gallery Images" value={counts?.gallery ?? '—'} icon={Image} />
        <AdminStatsCard label="Total Videos" value={counts?.videos ?? '—'} icon={Video} />
      </motion.div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="rounded-xl border border-black/10 bg-white px-4 py-3.5 text-sm font-medium text-center hover:border-gold hover:text-gold-dark transition-colors"
          >
            {a.label}
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-heading text-lg font-semibold mb-3">Recent Bookings</h2>
        <DataTable
          loading={recentBookings === null}
          columns={[
            { key: 'customer_name', label: 'Customer' },
            { key: 'event_type', label: 'Event Type' },
            { key: 'event_date', label: 'Event Date' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gold/15 text-gold-dark">
                  {row.status}
                </span>
              ),
            },
          ]}
          rows={recentBookings || []}
        />
      </div>
    </div>
  )
}
