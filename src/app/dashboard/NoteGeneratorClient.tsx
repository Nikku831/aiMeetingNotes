'use client'

import { useState, useTransition, useRef } from 'react'
import { generateNotes } from './actions'
import { Sparkles, Loader2, AlertCircle, CheckCircle2, ChevronUp, ChevronDown, Zap } from 'lucide-react'
import type { GenerateResult, ActionItem } from '@/types'
import Link from 'next/link'

interface Props {
  plan: 'free' | 'pro'
  todayCount: number
  dailyLimit: number
}

export default function NoteGeneratorClient({ plan, todayCount, dailyLimit }: Props) {
  const [transcript, setTranscript] = useState('')
  const [result, setResult] = useState<(GenerateResult & { id: string }) | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const resultRef = useRef<HTMLDivElement>(null)

  const remainingFree = dailyLimit - todayCount
  const isLimitReached = plan === 'free' && todayCount >= dailyLimit

  const handleGenerate = () => {
    if (!transcript.trim() || isPending) return
    setError(null)
    setResult(null)

    startTransition(async () => {
      const res = await generateNotes(transcript)
      if (res.error) {
        setError(res.error)
      } else if (res.data) {
        setResult(res.data)
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Usage bar */}
      <div className="glass-card rounded-xl p-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm text-slate-400">
              {plan === 'pro' ? 'Pro Plan — Unlimited generations' : `Free Plan — ${todayCount}/${dailyLimit} today`}
            </span>
            {plan === 'free' && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                isLimitReached
                  ? 'bg-red-500/20 text-red-400'
                  : remainingFree <= 1
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {isLimitReached ? 'Limit reached' : `${remainingFree} left`}
              </span>
            )}
            {plan === 'pro' && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400">
                Pro ✦
              </span>
            )}
          </div>
          {plan === 'free' && (
            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isLimitReached ? 'bg-red-500' : 'bg-gradient-to-r from-violet-500 to-indigo-500'
                }`}
                style={{ width: `${Math.min((todayCount / dailyLimit) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
        {plan === 'free' && (
          <Link
            href="/account"
            className="btn-secondary text-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <Zap className="w-3.5 h-3.5" />
            Upgrade to Pro
          </Link>
        )}
      </div>

      {/* Textarea */}
      <div className="space-y-3">
        <label htmlFor="transcript" className="block text-sm font-medium text-slate-300">
          Paste your meeting transcript
        </label>
        <textarea
          id="transcript"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          disabled={isLimitReached}
          placeholder={
            isLimitReached
              ? "You've reached today's free limit. Upgrade to Pro for unlimited access."
              : 'Paste or type your meeting transcript here…\n\nExample: "John: Let\'s discuss the Q3 roadmap. Sarah: We need to finalize the designs by Friday..."'
          }
          rows={10}
          className="input-field w-full resize-none font-mono text-sm leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-500">
            {transcript.length > 0 ? `${transcript.length.toLocaleString()} characters` : 'Min 20 characters required'}
          </span>
          <button
            id="generate-btn"
            onClick={handleGenerate}
            disabled={isPending || isLimitReached || transcript.trim().length < 20}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Notes
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-medium">{error}</p>
            {error.includes('limit') && (
              <Link href="/account" className="text-violet-400 text-sm hover:underline mt-1 inline-block">
                Upgrade to Pro →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Result */}
      {result && (
        <div ref={resultRef} className="space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Notes generated successfully</span>
          </div>

          {/* Summary */}
          <div className="glass-card rounded-xl p-5 border border-violet-500/20">
            <h3 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              Summary
            </h3>
            <p className="text-slate-200 text-sm leading-relaxed">{result.summary}</p>
          </div>

          {/* Action Items */}
          {result.action_items.length > 0 && (
            <div className="glass-card rounded-xl p-5 border border-indigo-500/20">
              <h3 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Action Items ({result.action_items.length})
              </h3>
              <ul className="space-y-2">
                {result.action_items.map((item: ActionItem, i: number) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-200 text-sm">{item.task}</p>
                      {(item.owner || item.due) && (
                        <div className="flex gap-3 mt-1">
                          {item.owner && (
                            <span className="text-xs text-slate-500">
                              👤 {item.owner}
                            </span>
                          )}
                          {item.due && (
                            <span className="text-xs text-slate-500">
                              📅 {item.due}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result.action_items.length === 0 && (
            <p className="text-slate-500 text-sm italic">No action items found in this transcript.</p>
          )}
        </div>
      )}
    </div>
  )
}
