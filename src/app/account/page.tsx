import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Crown, Zap, User, Calendar, LogOut } from 'lucide-react'
import AccountActionsClient from './AccountActionsClient'
import type { Profile } from '@/types'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account — AI Meeting Notes',
  description: 'Manage your AI Meeting Notes account and subscription',
}

export const dynamic = 'force-dynamic'

export default async function AccountPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  const [profileResult, usageResult, notesCountResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('usage_counters')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single(),
    supabase.from('meeting_notes').select('id', { count: 'exact' }).eq('user_id', user.id),
  ])

  const profile = profileResult.data as Profile | null
  const plan = profile?.plan ?? 'free'
  const todayCount = usageResult.data?.count ?? 0
  const totalNotes = notesCountResult.count ?? 0

  const signOut = async () => {
    'use server'
    const supabase = createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      {/* Nav */}
      <nav className="border-b border-white/5 backdrop-blur-sm sticky top-0 z-10 bg-slate-950/80">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">AI Meeting Notes</span>
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Account</h1>
        </div>

        {/* Success/cancel banners */}
        {searchParams.success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-emerald-400 text-sm flex items-center gap-2">
            <Crown className="w-4 h-4" />
            🎉 You&apos;re now on Pro! Enjoy unlimited AI note generation.
          </div>
        )}
        {searchParams.canceled && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-400 text-sm">
            Checkout was cancelled. Your plan has not changed.
          </div>
        )}

        {/* Profile info */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user.email}</p>
              <p className="text-slate-500 text-xs">Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="glass-card rounded-2xl p-6 border border-white/5 space-y-4">
          <h2 className="text-white font-semibold">Current Plan</h2>

          <div className={`flex items-center gap-3 p-4 rounded-xl border ${
            plan === 'pro'
              ? 'bg-violet-500/10 border-violet-500/30'
              : 'bg-slate-800/50 border-white/5'
          }`}>
            {plan === 'pro' ? (
              <Crown className="w-6 h-6 text-violet-400" />
            ) : (
              <Zap className="w-6 h-6 text-slate-400" />
            )}
            <div>
              <p className="text-white font-semibold text-sm">
                {plan === 'pro' ? 'Pro — $9/month' : 'Starter (Free)'}
              </p>
              <p className="text-slate-400 text-xs mt-0.5">
                {plan === 'pro'
                  ? 'Unlimited AI note generations'
                  : '3 AI note generations per day'}
              </p>
            </div>
            <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
              plan === 'pro'
                ? 'bg-violet-500/20 text-violet-300'
                : 'bg-slate-700 text-slate-300'
            }`}>
              {plan === 'pro' ? 'Active' : 'Free'}
            </span>
          </div>

          <AccountActionsClient
            plan={plan}
            hasStripeCustomer={!!profile?.stripe_customer_id}
          />
        </div>

        {/* Usage stats */}
        <div className="glass-card rounded-2xl p-6 border border-white/5">
          <h2 className="text-white font-semibold mb-4">Usage</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{todayCount}</p>
              <p className="text-slate-400 text-xs mt-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Generations today
              </p>
              {plan === 'free' && (
                <div className="mt-2 h-1 bg-slate-700 rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                    style={{ width: `${Math.min((todayCount / 3) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{totalNotes}</p>
              <p className="text-slate-400 text-xs mt-1">Total notes saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
