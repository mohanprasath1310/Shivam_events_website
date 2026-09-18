import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Star } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import DataTable from '../../components/admin/DataTable'
import AdminFormModal from '../../components/admin/AdminFormModal'
import ImageUploader from '../../components/admin/ImageUploader'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'
import { FormField, Input, Textarea } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'
import { sanitizeRow } from '../../utils/form'

const EMPTY = { customer_name: '', message: '', rating: 5, image_url: '', is_active: true }

export default function AdminTestimonials() {
  const [items, setItems] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    setItems(data || [])
  }

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    setEditingId(null)
    setForm(EMPTY)
    setModalOpen(true)
  }

  const openEdit = (row) => {
    setEditingId(row.id)
    setForm(sanitizeRow(row))
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      customer_name: form.customer_name,
      message: form.message,
      rating: Number(form.rating) || 5,
      image_url: form.image_url || null,
      is_active: !!form.is_active,
    }

    const query = editingId
      ? supabase.from('testimonials').update(payload).eq('id', editingId)
      : supabase.from('testimonials').insert([payload])

    const { error } = await query
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editingId ? 'Testimonial updated' : 'Testimonial added')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('testimonials').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Testimonial deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Testimonials</h1>
          <p className="text-sm text-black/50 mt-1">Manage customer reviews shown on the website</p>
        </div>
        <PrimaryButton onClick={openAdd} className="!px-4">
          <Plus className="h-4 w-4" /> Add Testimonial
        </PrimaryButton>
      </div>

      <div className="mt-6">
        <DataTable
          loading={items === null}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          columns={[
            { key: 'customer_name', label: 'Customer' },
            { key: 'rating', label: 'Rating', render: (r) => (
              <span className="flex items-center gap-0.5 text-gold-dark">
                {Array.from({ length: r.rating }).map((_, i) => <Star key={i} className="h-3.5 w-3.5" fill="currentColor" />)}
              </span>
            ) },
            { key: 'message', label: 'Message', render: (r) => <span className="line-clamp-1 max-w-xs">{r.message}</span> },
            { key: 'is_active', label: 'Status', render: (r) => (
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-black/5 text-black/40'}`}>
                {r.is_active ? 'Active' : 'Inactive'}
              </span>
            ) },
          ]}
          rows={items || []}
        />
      </div>

      <AdminFormModal open={modalOpen} title={editingId ? 'Edit Testimonial' : 'Add Testimonial'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploader bucket="testimonials" value={form.image_url} onUploaded={(url) => setForm((f) => ({ ...f, image_url: url }))} label="Customer Photo (optional)" />
          <FormField label="Customer Name">
            <Input required value={form.customer_name} onChange={(e) => setForm((f) => ({ ...f, customer_name: e.target.value }))} />
          </FormField>
          <FormField label="Message">
            <Textarea rows={4} required value={form.message} onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))} />
          </FormField>
          <FormField label="Rating (1-5)">
            <Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((f) => ({ ...f, rating: e.target.value }))} />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-gold" />
            Active
          </label>
          <PrimaryButton type="submit" loading={saving} className="w-full">
            {editingId ? 'Save Changes' : 'Add Testimonial'}
          </PrimaryButton>
        </form>
      </AdminFormModal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete testimonial from "${deleteTarget?.customer_name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
