import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Search } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import DataTable from '../../components/admin/DataTable'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'
import { Input, Select } from '../../components/common/FormFields'

const STATUSES = ['New', 'Read', 'Responded']
const STATUS_COLORS = {
  New: 'bg-blue-100 text-blue-700',
  Read: 'bg-yellow-100 text-yellow-700',
  Responded: 'bg-green-100 text-green-700',
}

export default function AdminMessages() {
  const [messages, setMessages] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    setMessages(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    if (!messages) return []
    return messages.filter((m) => {
      const matchesStatus = statusFilter === 'All' || m.status === statusFilter
      const matchesSearch =
        !search ||
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.phone?.includes(search)
      return matchesStatus && matchesSearch
    })
  }, [messages, search, statusFilter])

  const updateStatus = async (id, status) => {
    setMessages((list) => list.map((m) => (m.id === id ? { ...m, status } : m)))
    const { error } = await supabase.from('contact_messages').update({ status }).eq('id', id)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Status updated')
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('contact_messages').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Message deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Contact Messages</h1>
      <p className="text-sm text-black/50 mt-1">Messages submitted through the Contact page</p>

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
          loading={messages === null}
          onDelete={setDeleteTarget}
          columns={[
            { key: 'name', label: 'Name' },
            { key: 'phone', label: 'Phone' },
            { key: 'email', label: 'Email' },
            { key: 'message', label: 'Message', render: (r) => <span className="line-clamp-1 max-w-xs block">{r.message}</span> },
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
          ]}
          rows={filtered}
          emptyMessage="No messages match your filters"
        />
      </div>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete message from "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
