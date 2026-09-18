import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabase'
import { fadeUp } from '../../animations/variants'
import { useAuth } from '../../context/AuthContext'
import { FormField, Input } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'

export default function AdminSettings() {
  const { user } = useAuth()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      toast.error('Passwords do not match')
      return
    }

    setSaving(true)
    const { error } = await supabase.auth.updateUser({ password })
    setSaving(false)

    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Password updated')
    setPassword('')
    setConfirm('')
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Settings</h1>
      <p className="text-sm text-black/50 mt-1">Manage your admin account</p>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-6 max-w-md rounded-2xl border border-black/10 bg-white p-6"
      >
        <p className="text-sm text-black/60">
          Logged in as <span className="font-medium text-black">{user?.email}</span>
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <FormField label="New Password">
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </FormField>
          <FormField label="Confirm New Password">
            <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" />
          </FormField>
          <PrimaryButton type="submit" loading={saving} className="w-full">
            Update Password
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  )
}
