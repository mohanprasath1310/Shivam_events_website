import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import DataTable from '../../components/admin/DataTable'
import AdminFormModal from '../../components/admin/AdminFormModal'
import ImageUploader from '../../components/admin/ImageUploader'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'
import { FormField, Input, Textarea } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'
import { sanitizeRow } from '../../utils/form'

const EMPTY = {
  name: '', slug: '', short_description: '', description: '', cover_image: '',
  price: '', offer_price: '', max_charge: '', min_shots: 1, max_shots: 50,
  max_images: 5, max_image_size_mb: 5,
  features: '', display_order: 0, is_featured: false, is_active: true,
}

const slugify = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')

export default function AdminServices() {
  const [services, setServices] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('services').select('*').order('display_order')
    if (error) toast.error(error.message)
    setServices(data || [])
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
    const clean = sanitizeRow(row)
    setForm({
      ...clean,
      price: clean.price !== '' ? String(clean.price) : '',
      offer_price: clean.offer_price !== '' ? String(clean.offer_price) : '',
      max_charge: clean.max_charge !== '' ? String(clean.max_charge) : '',
      min_shots: clean.min_shots !== '' ? String(clean.min_shots) : '',
      max_shots: clean.max_shots !== '' ? String(clean.max_shots) : '',
      max_images: clean.max_images !== '' ? String(clean.max_images) : '',
      max_image_size_mb: clean.max_image_size_mb !== '' ? String(clean.max_image_size_mb) : '',
      display_order: clean.display_order !== '' ? String(clean.display_order) : '',
      features: (row.features || []).join(', '),
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      short_description: form.short_description,
      description: form.description,
      cover_image: form.cover_image || null,
      price: form.price ? Number(form.price) : null,
      offer_price: form.offer_price ? Number(form.offer_price) : null,
      max_charge: form.max_charge ? Number(form.max_charge) : null,
      min_shots: form.min_shots ? Number(form.min_shots) : null,
      max_shots: form.max_shots ? Number(form.max_shots) : null,
      max_images: form.max_images ? Number(form.max_images) : null,
      max_image_size_mb: form.max_image_size_mb ? Number(form.max_image_size_mb) : null,
      features: form.features ? form.features.split(',').map((f) => f.trim()).filter(Boolean) : [],
      display_order: Number(form.display_order) || 0,
      is_featured: !!form.is_featured,
      is_active: !!form.is_active,
    }

    const query = editingId
      ? supabase.from('services').update(payload).eq('id', editingId)
      : supabase.from('services').insert([payload])

    const { error } = await query
    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editingId ? 'Service updated' : 'Service added')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('services').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Service deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Services</h1>
          <p className="text-sm text-black/50 mt-1">Manage the services shown on your website</p>
        </div>
        <PrimaryButton onClick={openAdd} className="!px-4">
          <Plus className="h-4 w-4" /> Add Service
        </PrimaryButton>
      </div>

      <div className="mt-6">
        <DataTable
          loading={services === null}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          columns={[
            {
              key: 'cover_image', label: '', render: (r) => (
                <div className="h-10 w-10 rounded-lg bg-offwhite overflow-hidden">
                  {r.cover_image && <img src={r.cover_image} alt="" className="h-full w-full object-cover" />}
                </div>
              ),
            },
            { key: 'name', label: 'Name' },
            { key: 'price', label: 'Price', render: (r) => `₹${r.offer_price || r.price || 0}` },
            { key: 'max_charge', label: 'Max Charge', render: (r) => r.max_charge ? `₹${r.max_charge}` : '—' },
            { key: 'display_order', label: 'Order' },
            {
              key: 'is_active', label: 'Status', render: (r) => (
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${r.is_active ? 'bg-green-100 text-green-700' : 'bg-black/5 text-black/40'}`}>
                  {r.is_active ? 'Active' : 'Inactive'}
                </span>
              ),
            },
          ]}
          rows={services || []}
        />
      </div>

      <AdminFormModal open={modalOpen} title={editingId ? 'Edit Service' : 'Add Service'} onClose={() => setModalOpen(false)} wide>
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploader bucket="services" value={form.cover_image} onUploaded={(url) => setForm((f) => ({ ...f, cover_image: url }))} label="Cover Image" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Service Name">
              <Input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </FormField>
            <FormField label="Slug (URL)">
              <Input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} placeholder="auto-generated if left blank" />
            </FormField>
          </div>

          <FormField label="Short Description">
            <Input value={form.short_description} onChange={(e) => setForm((f) => ({ ...f, short_description: e.target.value }))} />
          </FormField>

          <FormField label="Full Description">
            <Textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </FormField>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <FormField label="Price (₹)">
              <Input type="text" inputMode="numeric" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="e.g. 5000" />
            </FormField>
            <FormField label="Offer Price (₹)">
              <Input type="text" inputMode="numeric" value={form.offer_price} onChange={(e) => setForm((f) => ({ ...f, offer_price: e.target.value }))} placeholder="e.g. 4000" />
            </FormField>
            <FormField label="Display Order">
              <Input type="text" inputMode="numeric" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} placeholder="e.g. 1" />
            </FormField>
          </div>

          <FormField label="Included Features (comma separated)">
            <Input value={form.features} onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} placeholder="Sound system, Lighting, DJ console" />
          </FormField>

          <div className="border-t border-black/10 pt-4">
            <p className="text-sm font-semibold text-black/70 mb-3">Booking Configuration</p>

            <FormField label="Maximum Standard Charge (₹)">
              <Input
                type="number"
                value={form.max_charge}
                onChange={(e) => setForm((f) => ({ ...f, max_charge: e.target.value }))}
                placeholder="e.g. 25000"
              />
            </FormField>
            <p className="text-xs text-black/40 -mt-2 mb-4">
              Compared against the customer's expected budget on the booking page. Leave blank to skip this check.
            </p>

            <p className="text-xs font-medium text-black/50 mb-2">Paper Blast only — shot quantity limits</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField label="Minimum Shots">
                <Input type="number" value={form.min_shots} onChange={(e) => setForm((f) => ({ ...f, min_shots: e.target.value }))} />
              </FormField>
              <FormField label="Maximum Shots">
                <Input type="number" value={form.max_shots} onChange={(e) => setForm((f) => ({ ...f, max_shots: e.target.value }))} />
              </FormField>
            </div>

            <p className="text-xs font-medium text-black/50 mb-2">Decoration only — inspiration image limits</p>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Max Images">
                <Input type="number" value={form.max_images} onChange={(e) => setForm((f) => ({ ...f, max_images: e.target.value }))} />
              </FormField>
              <FormField label="Max Size per Image (MB)">
                <Input type="number" value={form.max_image_size_mb} onChange={(e) => setForm((f) => ({ ...f, max_image_size_mb: e.target.value }))} />
              </FormField>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-gold" />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} className="accent-gold" />
              Active
            </label>
          </div>

          <PrimaryButton type="submit" loading={saving} className="w-full">
            {editingId ? 'Save Changes' : 'Add Service'}
          </PrimaryButton>
        </form>
      </AdminFormModal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.name}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}