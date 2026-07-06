import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In — AI Meeting Notes',
  description: 'Sign in to your AI Meeting Notes account',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet-600/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
      </div>
      <div className="relative w-full max-w-md">{children}</div>
    </div>
  )
}
