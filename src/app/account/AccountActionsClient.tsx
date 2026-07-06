'use client'

import { useState } from 'react'
import { Loader2, ArrowUpRight, ExternalLink } from 'lucide-react'

interface Props {
  plan: 'free' | 'pro'
  hasStripeCustomer: boolean
}

export default function AccountActionsClient({ plan, hasStripeCustomer }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpgrade = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  const handlePortal = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/stripe/create-portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Something went wrong')
        setLoading(false)
      }
    } catch {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {plan === 'free' && (
        <button
          id="upgrade-btn"
          onClick={handleUpgrade}
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ArrowUpRight className="w-4 h-4" />
          )}
          {loading ? 'Redirecting to Stripe…' : 'Upgrade to Pro — $9/mo'}
        </button>
      )}

      {plan === 'pro' && hasStripeCustomer && (
        <button
          id="manage-subscription-btn"
          onClick={handlePortal}
          disabled={loading}
          className="btn-secondary w-full flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ExternalLink className="w-4 h-4" />
          )}
          {loading ? 'Opening portal…' : 'Manage Subscription'}
        </button>
      )}
    </div>
  )
}
