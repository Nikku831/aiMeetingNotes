import Link from 'next/link'
import type { Metadata } from 'next'
import {
  Sparkles,
  CheckCircle2,
  Zap,
  History,
  Shield,
  ArrowRight,
  Star,
  Users,
  Crown,
  Check,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'AI Meeting Notes — Turn Meetings into Action',
  description:
    'AI Meeting Notes uses Llama 3.3 to instantly convert your meeting transcripts into clear summaries and actionable to-do lists. Free to start, Pro for power users.',
}

const features = [
  {
    icon: Sparkles,
    title: 'Instant AI Summaries',
    description:
      'Paste any meeting transcript and get a concise, readable summary in seconds — powered by Llama 3.3-70b.',
    color: 'violet',
  },
  {
    icon: CheckCircle2,
    title: 'Auto Action Items',
    description:
      'Every task, owner, and deadline is automatically extracted and structured as a clean checklist you can act on immediately.',
    color: 'indigo',
  },
  {
    icon: History,
    title: 'Searchable History',
    description:
      'Every set of notes is saved to your personal history. Revisit, review, and share any past meeting at any time.',
    color: 'sky',
  },
  {
    icon: Shield,
    title: 'Private by Default',
    description:
      'Your transcripts never train AI models. Row-level security ensures only you can see your data — ever.',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Blazing Fast',
    description:
      'Results in under 5 seconds. No waiting, no spinning, no frustration — just instant clarity from every meeting.',
    color: 'amber',
  },
  {
    icon: Users,
    title: 'Built for Teams',
    description:
      'Works with Zoom, Google Meet, Teams, and any transcript format. If you can paste it, we can summarize it.',
    color: 'pink',
  },
]

const testimonials = [
  {
    quote: 'I used to spend 20 minutes writing meeting summaries. Now it takes 10 seconds.',
    author: 'Sarah K.',
    role: 'Product Manager',
  },
  {
    quote: 'The action items are scarily accurate. It catches things I would have missed.',
    author: 'Marcus T.',
    role: 'Engineering Lead',
  },
  {
    quote: 'Finally a tool that respects my privacy and actually works. Worth every penny.',
    author: 'Priya N.',
    role: 'Startup Founder',
  },
]

const colorMap: Record<string, string> = {
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  sky: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white overflow-x-hidden">
      {/* Background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-700/10 blur-[100px]" />
      </div>

      {/* ─── Navbar ─── */}
      <header className="relative z-10 border-b border-white/5 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white text-base tracking-tight">AI Meeting Notes</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-slate-400 hover:text-white text-sm transition-colors">Features</a>
            <a href="#pricing" className="text-slate-400 hover:text-white text-sm transition-colors">Pricing</a>
            <Link href="/login" className="text-slate-400 hover:text-white text-sm transition-colors">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm">
              Get started free
            </Link>
          </nav>
          <div className="md:hidden flex items-center gap-2">
            <Link href="/login" className="text-slate-400 text-sm">Sign in</Link>
            <Link href="/signup" className="btn-primary text-sm">Sign up</Link>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative z-10 pt-24 pb-20 px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Llama 3.3-70b · Instant results
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Turn meetings into{' '}
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-sky-400 bg-clip-text text-transparent">
              action
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Paste your meeting transcript and get an AI-generated summary plus a structured action-item list in seconds. No more manually writing notes after every call.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              id="hero-cta-primary"
              className="btn-primary text-base px-6 py-3 flex items-center gap-2 shadow-lg shadow-violet-500/25"
            >
              Start for free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              id="hero-cta-secondary"
              className="btn-secondary text-base px-6 py-3"
            >
              Sign in
            </Link>
          </div>

          <p className="mt-4 text-slate-600 text-sm">No credit card required · 3 free generations/day</p>
        </div>

        {/* Demo card */}
        <div className="relative max-w-3xl mx-auto mt-16">
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/10 to-indigo-500/10 rounded-3xl blur-xl" />
          <div className="relative glass-card rounded-2xl p-6 border border-white/10 text-left">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="ml-2 text-slate-500 text-xs">AI Meeting Notes</span>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1 font-medium uppercase tracking-wider">Transcript Input</p>
                <div className="bg-slate-900/60 rounded-lg p-3 text-slate-400 text-sm font-mono leading-relaxed border border-white/5">
                  John: We need to finalize the Q3 roadmap. Sarah: I&apos;ll have the design specs ready by Thursday. John: Great, and Marcus, can you set up the staging environment before Friday&apos;s demo?
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-violet-500/30 to-transparent" />
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                  <Sparkles className="w-3 h-3 text-violet-400" />
                  <span className="text-violet-400 text-xs font-medium">AI Generated</span>
                </div>
                <div className="h-px flex-1 bg-gradient-to-l from-indigo-500/30 to-transparent" />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-violet-500/5 rounded-lg p-3 border border-violet-500/10">
                  <p className="text-xs text-violet-400 font-semibold uppercase tracking-wider mb-2">Summary</p>
                  <p className="text-slate-300 text-sm">The team discussed finalizing the Q3 roadmap. Key deliverables were assigned with deadlines ahead of Friday&apos;s demo.</p>
                </div>
                <div className="bg-indigo-500/5 rounded-lg p-3 border border-indigo-500/10">
                  <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-2">Action Items</p>
                  <ul className="space-y-1.5">
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                      Design specs ready · Sarah · Thu
                    </li>
                    <li className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                      Staging environment · Marcus · Fri
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need after every meeting
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Built for busy professionals who spend too much time on follow-up and not enough on actual work.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon
              const colorClass = colorMap[feature.color]
              return (
                <div
                  key={feature.title}
                  className="glass-card rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all duration-200 group"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="relative z-10 py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.author} className="glass-card rounded-2xl p-6 border border-white/5">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-4">&quot;{t.quote}&quot;</p>
                <div>
                  <p className="text-white text-sm font-medium">{t.author}</p>
                  <p className="text-slate-500 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="relative z-10 py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Simple, honest pricing</h2>
            <p className="text-slate-400">Start free, upgrade when you need more.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {/* Free */}
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-5 h-5 text-slate-400" />
                <span className="font-bold text-white text-lg">Starter</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">Perfect for occasional meetings</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$0</span>
                <span className="text-slate-500 text-sm mb-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  '3 AI note generations per day',
                  'Full summaries + action items',
                  'Searchable note history',
                  'Email/password auth',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                id="pricing-free-cta"
                className="btn-secondary w-full text-center flex items-center justify-center"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl p-8 border border-violet-500/40 bg-gradient-to-b from-violet-500/10 to-indigo-500/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <Crown className="w-5 h-5 text-violet-400" />
                <span className="font-bold text-white text-lg">Pro</span>
              </div>
              <p className="text-slate-400 text-sm mb-6">For teams that meet every day</p>
              <div className="flex items-end gap-1 mb-8">
                <span className="text-4xl font-bold text-white">$9</span>
                <span className="text-slate-500 text-sm mb-1">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  'Unlimited AI note generations',
                  'Full summaries + action items',
                  'Searchable note history',
                  'Priority AI processing',
                  'Email/password auth',
                  'Cancel anytime',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-violet-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/signup?plan=pro"
                id="pricing-pro-cta"
                className="btn-primary w-full text-center flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
              >
                <Crown className="w-4 h-4" />
                Start Pro — $9/mo
              </Link>
              <p className="text-center text-slate-600 text-xs mt-3">Test card: 4242 4242 4242 4242</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA Banner ─── */}
      <section className="relative z-10 py-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="glass-card rounded-3xl p-10 border border-white/10">
            <h2 className="text-3xl font-bold text-white mb-3">Your next meeting is in 30 minutes.</h2>
            <p className="text-slate-400 mb-8">Set up your account before it starts. Takes 60 seconds.</p>
            <Link
              href="/signup"
              id="bottom-cta"
              className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2 shadow-lg shadow-violet-500/25"
            >
              Create free account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="relative z-10 border-t border-white/5 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-white text-sm font-semibold">AI Meeting Notes</span>
          </div>
          <p className="text-slate-600 text-sm">© {new Date().getFullYear()} AI Meeting Notes. All rights reserved.</p>
          <div className="flex gap-4 text-slate-600 text-sm">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
