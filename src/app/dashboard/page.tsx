import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, Settings, LogOut, History } from 'lucide-react'
import Link from 'next/link'
import NoteGeneratorClient from './NoteGeneratorClient'
import NoteHistoryClient from './NoteHistoryClient'
import type { MeetingNote, Profile } from '@/types'

export const dynamic = 'force-dynamic'

const FREE_DAILY_LIMIT = 3

export default async function DashboardPage() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const today = new Date().toISOString().split('T')[0]

  // Parallel fetches
  const [profileResult, notesResult, usageResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('meeting_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20),
    supabase
      .from('usage_counters')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single(),
  ])

  const profile = profileResult.data as Profile | null
  const notes = (notesResult.data ?? []) as MeetingNote[]
  const todayCount = usageResult.data?.count ?? 0
  const plan = profile?.plan ?? 'free'

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-sm tracking-tight">AI Meeting Notes</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/account"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              <Settings className="w-4 h-4" />
              Account
            </Link>
            <form action={signOut}>
              <button
                id="signout-btn"
                type="submit"
                className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">
            Welcome back, <span className="text-slate-300">{user.email}</span>
          </p>
        </div>

        {/* Generator */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-violet-400" />
            Generate Notes
          </h2>
          <NoteGeneratorClient
            plan={plan as 'free' | 'pro'}
            todayCount={todayCount}
            dailyLimit={FREE_DAILY_LIMIT}
          />
        </section>

        {/* History */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Meeting History
            <span className="ml-auto text-sm font-normal text-slate-500">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
          </h2>
          <NoteHistoryClient notes={notes} />
        </section>
      </div>
    </div>
  )
}
