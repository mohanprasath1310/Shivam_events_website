import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { Input } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'
import { SkeletonGrid } from '../../components/common/SkeletonLoader'

export default function AdminPricing() {
  const [services, setServices] = useState(null)
  const [savingId, setSavingId] = useState(null)

  const load = async () => {
    const { data, error } = await supabase.from('services').select('*').order('display_order')
    if (error) toast.error(error.message)
    setServices(data || [])
  }

  useEffect(() => { load() }, [])

  const updateField = (id, field, value) => {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  // Convert to number or null — empty string / null / undefined all become null
  const toNum = (val) => {
    if (val === '' || val === null || val === undefined) return null
    const n = Number(val)
    return isNaN(n) ? null : n
  }

  const save = async (service) => {
    setSavingId(service.id)
    const payload = {
      price: toNum(service.price),
      offer_price: toNum(service.offer_price),
    }
    const { error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', service.id)
    setSavingId(null)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success(`${service.name} pricing updated`)
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Pricing</h1>
      <p className="text-sm text-black/50 mt-1">Update service prices — changes reflect on the website immediately</p>

      <div className="mt-6">
        {services === null ? (
          <SkeletonGrid count={4} />
        ) : (
          <div className="space-y-3">
            {services.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-black/10 bg-white p-4 flex flex-col sm:flex-row sm:items-end gap-4"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{s.name}</p>
                  <p className="text-xs text-black/40 mt-0.5">
                    Starting from ₹{s.offer_price || s.price || 0}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3 w-full sm:w-64">
                  <div>
                    <label className="text-xs text-black/50 mb-1 block">Original Price</label>
                    <Input
                      type="number"
                      value={s.price ?? ''}
                      onChange={(e) => updateField(s.id, 'price', e.target.value)}
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-black/50 mb-1 block">Offer Price</label>
                    <Input
                      type="number"
                      value={s.offer_price ?? ''}
                      onChange={(e) => updateField(s.id, 'offer_price', e.target.value)}
                      placeholder="e.g. 4000"
                    />
                  </div>
                </div>
                <PrimaryButton
                  onClick={() => save(s)}
                  loading={savingId === s.id}
                  className="!px-5 !py-2.5 shrink-0"
                >
                  Save
                </PrimaryButton>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}