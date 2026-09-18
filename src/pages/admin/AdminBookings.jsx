import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import DataTable from '../../components/admin/DataTable'
import AdminFormModal from '../../components/admin/AdminFormModal'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'
import { Input, Select } from '../../components/common/FormFields'

const STATUSES = ['New', 'Pending', 'Confirmed', 'Completed', 'Cancelled']
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Confirmed: 'bg-green-100 text-green-700',
  Completed: 'bg-black/10 text-black/60',
  Cancelled: 'bg-red-100 text-red-600',
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewing, setViewing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    setBookings(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!bookings) return []
    return bookings.filter((b) => {
      const matchesStatus = statusFilter === 'All' || b.status === statusFilter
      const matchesSearch =
        !search ||
        b.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
        b.phone?.includes(search)
      return matchesStatus && matchesSearch
    })
  }, [bookings, search, statusFilter])

  const updateStatus = async (id, status) => {
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)))
    const { error } = await supabase.from('bookings').update({ status }).eq('id', id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Status updated')
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('bookings').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Booking deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Bookings</h1>
      <p className="text-sm text-black/50 mt-1">All customer booking and enquiry requests</p>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or phone" className="pl-10" />
        </div>
        <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="sm:w-52">
          <option value="All">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      <div className="mt-5">
        <DataTable
          loading={bookings === null}
          onDelete={setDeleteTarget}
          columns={[
            { key: 'customer_name', label: 'Customer' },
            { key: 'phone', label: 'Phone' },
            { key: 'event_type', label: 'Event Type' },
            { key: 'event_date', label: 'Event Date' },
            { key: 'location', label: 'Location' },
            {
              key: 'status', label: 'Status', render: (row) => (
                <motion.select
                  layout
                  value={row.status}
                  onChange={(e) => updateStatus(row.id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1.5 rounded-full border-0 outline-none cursor-pointer ${STATUS_COLORS[row.status] || 'bg-black/5'}`}
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </motion.select>
              ),
            },
            {
              key: 'view', label: '', render: (row) => (
                <button onClick={() => setViewing(row)} aria-label="View details" className="h-8 w-8 rounded-lg hover:bg-black/5 flex items-center justify-center">
                  <Eye className="h-4 w-4 text-black/50" />
                </button>
              ),
            },
          ]}
          rows={filtered}
          emptyMessage="No bookings match your filters"
        />
      </div>

      <AdminFormModal open={!!viewing} title="Booking Details" onClose={() => setViewing(null)}>
        {viewing && (
          <div className="space-y-3 text-sm">
            {[
              ['Customer Name', viewing.customer_name],
              ['Phone', viewing.phone],
              ['Email', viewing.email],
              ['Event Type', viewing.event_type],
              ['Event Date', viewing.event_date],
              ['Event Time', viewing.event_time],
              ['Location', viewing.location],
              ['Expected Budget', viewing.expected_budget ? `₹${viewing.expected_budget}` : viewing.budget],
              ['Needs / Add-ons', viewing.addons?.join(', ')],
              ['Custom Add-on', viewing.addon_other],
              ['Special Requirements', viewing.special_requirements],
              ['Paper Blast Quantity', viewing.paper_blast_quantity],
              ['Decoration Description', viewing.decoration_description],
              ['Message', viewing.message],
              ['Status', viewing.status],
            ].map(([label, value]) => value && (
              <div key={label} className="flex justify-between gap-4 py-2 border-b border-black/5 last:border-0">
                <span className="text-black/50">{label}</span>
                <span className="font-medium text-right">{value}</span>
              </div>
            ))}
            {viewing.decoration_images?.length > 0 && (
              <div className="pt-2">
                <p className="text-black/50 mb-2">Inspiration Images</p>
                <div className="grid grid-cols-4 gap-2">
                  {viewing.decoration_images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden border border-black/10">
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </AdminFormModal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete booking from "${deleteTarget?.customer_name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
