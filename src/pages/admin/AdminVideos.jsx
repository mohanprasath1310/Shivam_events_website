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
const EMPTY = { title: '', category: CATEGORIES[0], video_type: 'youtube', video_url: '', thumbnail_url: '', display_order: 0, is_featured: false }

export default function AdminVideos() {
  const [videos, setVideos] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = async () => {
    const { data, error } = await supabase.from('videos').select('*').order('display_order')
    if (error) toast.error(error.message)
    setVideos(data || [])
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
      video_type: form.video_type,
      video_url: form.video_url,
      thumbnail_url: form.thumbnail_url || null,
      display_order: Number(form.display_order) || 0,
      is_featured: !!form.is_featured,
    }

    const query = editingId
      ? supabase.from('videos').update(payload).eq('id', editingId)
      : supabase.from('videos').insert([payload])

    const { error } = await query
    setSaving(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(editingId ? 'Video updated' : 'Video added')
    setModalOpen(false)
    load()
  }

  const handleDelete = async () => {
    setDeleting(true)
    const { error } = await supabase.from('videos').delete().eq('id', deleteTarget.id)
    setDeleting(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Video deleted')
    setDeleteTarget(null)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Videos</h1>
          <p className="text-sm text-black/50 mt-1">Manage event videos across YouTube, Instagram, or uploads</p>
        </div>
        <PrimaryButton onClick={openAdd} className="!px-4">
          <Plus className="h-4 w-4" /> Add Video
        </PrimaryButton>
      </div>

      <div className="mt-6">
        <DataTable
          loading={videos === null}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          columns={[
            { key: 'title', label: 'Title' },
            { key: 'category', label: 'Category' },
            { key: 'video_type', label: 'Type' },
            { key: 'display_order', label: 'Order' },
          ]}
          rows={videos || []}
        />
      </div>

      <AdminFormModal open={modalOpen} title={editingId ? 'Edit Video' : 'Add Video'} onClose={() => setModalOpen(false)}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField label="Video Title">
            <Input required value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Category">
              <Select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </Select>
            </FormField>
            <FormField label="Video Type">
              <Select value={form.video_type} onChange={(e) => setForm((f) => ({ ...f, video_type: e.target.value }))}>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="uploaded">Uploaded Video</option>
              </Select>
            </FormField>
          </div>

          {form.video_type === 'uploaded' ? (
            <ImageUploader
              bucket="videos"
              accept="video/*"
              value={form.video_url}
              onUploaded={(url) => setForm((f) => ({ ...f, video_url: url }))}
              label="Video File"
            />
          ) : (
            <FormField label="Video URL">
              <Input
                required
                value={form.video_url}
                onChange={(e) => setForm((f) => ({ ...f, video_url: e.target.value }))}
                placeholder={form.video_type === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://instagram.com/reel/...'}
              />
            </FormField>
          )}

          <ImageUploader
            bucket="videos"
            value={form.thumbnail_url}
            onUploaded={(url) => setForm((f) => ({ ...f, thumbnail_url: url }))}
            label="Thumbnail"
          />

          <FormField label="Display Order">
            <Input type="number" value={form.display_order} onChange={(e) => setForm((f) => ({ ...f, display_order: e.target.value }))} />
          </FormField>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} className="accent-gold" />
            Show on homepage (Featured)
          </label>

          <PrimaryButton type="submit" loading={saving} className="w-full">
            {editingId ? 'Save Changes' : 'Add Video'}
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
