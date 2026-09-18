import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { UploadCloud, X, ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

/**
 * Uploads a file to the given Supabase Storage bucket and calls onUploaded(publicUrl).
 * Renders a preview + drag-and-drop zone + progress state.
 */
export default function ImageUploader({ bucket, value, onUploaded, accept = 'image/*', label = 'Upload Image' }) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef(null)

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`

    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: false })
    setUploading(false)

    if (error) {
      toast.error(`Upload failed: ${error.message}`)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    onUploaded(data.publicUrl)
    toast.success('Upload complete')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) upload(file)
  }

  return (
    <div>
      <label className="block text-sm font-medium text-black/70 mb-1.5">{label}</label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-black/10 h-40 group">
          {accept.startsWith('video') ? (
            <video src={value} className="h-full w-full object-cover" muted />
          ) : (
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
          <button
            type="button"
            onClick={() => onUploaded(null)}
            className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            aria-label="Remove"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`h-40 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver ? 'border-gold bg-gold/5' : 'border-black/15 hover:border-black/30'
          }`}
        >
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            >
              <UploadCloud className="h-6 w-6 text-gold-dark" />
            </motion.div>
          ) : (
            <ImageIcon className="h-6 w-6 text-black/30" />
          )}
          <p className="text-xs text-black/40 text-center px-4">
            {uploading ? 'Uploading…' : 'Drag & drop or click to upload'}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => upload(e.target.files?.[0])}
      />
    </div>
  )
}
