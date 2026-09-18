import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import DataTable from '../../components/admin/DataTable'
import AdminFormModal from '../../components/admin/AdminFormModal'
import ImageUploader from '../../components/admin/ImageUploader'
import ConfirmDeleteModal from '../../components/common/ConfirmDeleteModal'
import { FormField, Input, Select } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'
import { sanitizeRow } from '../../utils/form'

const CATEGORIES = ['DJ Events', 'Paper Blast', 'Decoration']
const EMPTY = { title: '', category: CATEGORIES[0], media_type: 'image', media_url: '', thumbnail_url: '', display_order: 0, is_featured: false }

export default function AdminGallery() {
  const [items, setItems] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('gallery').select('*').order('display_order')
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
      title: form.title,
      category: form.category,
      media_type: form.media_type,
      media_url: form.media_url || null,
      thumbnail_url: form.thumbnail_url || null,
      display_order: Number(form.display_order) || 0,
      is_featured: !!form.is_featured,
    }

    const query = editingId
      ? supabase.from('gallery').update(payload).eq('id', editingId)
      : supabase.from('gallery').insert([payload])

    const { error } = await query
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editingId ? 'Item updated' : 'Item added')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('gallery').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Item deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Gallery</h1>
          <p className="text-sm text-black/50 mt-1">Manage photos and video posts in the gallery</p>
        </div>
        <PrimaryButton onClick={openAdd} className="!px-4">
          <Plus className="h-4 w-4" /> Add Item
        </PrimaryButton>
      </div>

      <div className="mt-6">
        <DataTable
          loading={items === null}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          columns={[
            {
              key: 'media_url', label: '', render: (r) => (
                <div className="h-10 w-10 rounded-lg bg-offwhite overflow-hidden">
                  {(r.thumbnail_url || r.media_url) && <img src={r.thumbnail_url || r.media_url} alt="" className="h-full w-full object-cover" />}
                </div>
              ),
            },
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'media_type', label: 'Type' },
            { key: 'display_order', label: 'Order' },
          ]}
          rows={items || []}
        />
      </div>

      <AdminFormModal open={modalOpen} title={editingId ? 'Edit Gallery Item' : 'Add Gallery Item'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <ImageUploader
            bucket="gallery"
            value={form.media_url}
            accept={form.media_type === 'video' ? 'video/*' : 'image/*'}
            onUploaded={(url) => setForm((f) => ({ ...f, media_url: url }))}
            label="Media File"
          />

          <FormField label="Title">
            <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Media Type">
              <Select value={form.media_type} onChange={(e) => setForm((f) => ({ ...f, media_type: e.target.value }))}>
                <option value="image">Image</option>
                <option value="video">Video</option>
              </Select>
            </FormField>
          </div>

          <FormField label="Display Order">
            <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
          </FormField>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-gold" />
            Show on homepage (Featured)
          </label>

          <PrimaryButton type="submit" loading={saving} className="w-full">
            {editingId ? 'Save Changes' : 'Add Item'}
          </PrimaryButton>
        </form>
      </AdminFormModal>

      <ConfirmDeleteModal
        open={!!deleteTarget}
        title={`Delete "${deleteTarget?.title}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
