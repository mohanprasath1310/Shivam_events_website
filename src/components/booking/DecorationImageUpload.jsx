import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ImagePlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../../lib/supabase'

const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function DecorationImageUpload({ value = [], onChange, maxCount = 5, maxSizeMb = 5 }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || [])
    const remaining = maxCount - value.length
    if (remaining <= 0) {
      toast.error(`You can upload a maximum of ${maxCount} images`)
      return
    }

    const toUpload = files.slice(0, remaining)
    setUploading(true)

    for (const file of toUpload) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: unsupported format (use JPG, PNG, or WEBP)`)
        continue
      }
      if (file.size > maxSizeMb * 1024 * 1024) {
        toast.error(`${file.name}: exceeds ${maxSizeMb}MB limit`)
        continue
      }

      const ext = file.name.split('.').pop()
      const path = `${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('decoration-inspirations').upload(path, file)

      if (error) {
        toast.error(`Upload failed: ${error.message}`)
        continue
      }

      const { data } = supabase.storage.from('decoration-inspirations').getPublicUrl(path)
      onChange([...value, data.publicUrl])
    }

    setUploading(false)
  }

  const removeAt = (index) => {
    onChange(value.filter((_, i) => i !== index))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-black/70 mb-2">
        Inspiration Images <span className="text-black/40 font-normal">(up to {maxCount}, optional)</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <AnimatePresence>
          {value.map((url, i) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative aspect-square rounded-xl overflow-hidden border border-black/10 group"
            >
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute top-1.5 right-1.5 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {value.length < maxCount && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-square rounded-xl border-2 border-dashed border-black/15 hover:border-black/30 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
          >
            <ImagePlus className="h-5 w-5 text-black/30" />
            <span className="text-[10px] text-black/40">{uploading ? 'Uploading…' : 'Add'}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />

      <p className="text-xs text-black/40 mt-2">JPG, PNG, or WEBP · max {maxSizeMb}MB each</p>
    </div>
  )
}
