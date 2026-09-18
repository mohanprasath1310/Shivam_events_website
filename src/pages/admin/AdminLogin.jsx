import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Mail } from 'lucide-react'
import { fadeUp } from '../../animations/variants'
import { useAuth } from '../../context/AuthContext'
import { FormField, Input } from '../../components/common/FormFields'
import PrimaryButton from '../../components/common/PrimaryButton'

export default function AdminLogin() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: signInError } = await signIn(email, password)

    setLoading(false)
    if (signInError) {
      setError(signInError.message)
      return
    }
    navigate(location.state?.from || '/admin', { replace: true })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm bg-white rounded-2xl p-8"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold">SHIVAM EVENTS</h1>
          <p className="text-sm text-black/50 mt-1">Admin Login</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FormField label="Email">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-10"
              />
            </div>
          </FormField>
          <FormField label="Password">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10"
              />
            </div>
          </FormField>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <PrimaryButton type="submit" loading={loading} className="w-full">
            Login
          </PrimaryButton>
        </form>
      </motion.div>
    </div>
  )
}
