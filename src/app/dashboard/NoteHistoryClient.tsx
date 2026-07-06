'use client'

import { useState, useTransition } from 'react'
import { deleteNote } from './actions'
import { ChevronDown, ChevronUp, Trash2, FileText, CheckSquare, Calendar } from 'lucide-react'
import type { MeetingNote, ActionItem } from '@/types'

interface Props {
  notes: MeetingNote[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function NoteCard({ note }: { note: MeetingNote }) {
  const [expanded, setExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (!confirm('Delete this meeting note?')) return
    startTransition(() => deleteNote(note.id))
  }

  return (
    <div className="glass-card rounded-xl border border-white/5 overflow-hidden transition-all duration-200 hover:border-white/10">
      {/* Header */}
      <div
        className="flex items-center gap-3 p-4 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
          <FileText className="w-4 h-4 text-violet-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-slate-200 text-sm font-medium truncate">
            {note.summary.slice(0, 80)}…
          </p>
          <div className="flex items-center gap-3 mt-0.5">
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {formatDate(note.created_at)}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <CheckSquare className="w-3 h-3" />
              {(note.action_items as ActionItem[]).length} action{(note.action_items as ActionItem[]).length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            id={`delete-note-${note.id}`}
            onClick={(e) => { e.stopPropagation(); handleDelete() }}
            disabled={isPending}
            className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </div>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-white/5 p-4 space-y-4 animate-fade-in">
          {/* Summary */}
          <div>
            <h4 className="text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">Summary</h4>
            <p className="text-slate-300 text-sm leading-relaxed">{note.summary}</p>
          </div>

          {/* Action Items */}
          {(note.action_items as ActionItem[]).length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-2">
                Action Items
              </h4>
              <ul className="space-y-2">
                {(note.action_items as ActionItem[]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-4 h-4 rounded bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold mt-0.5">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-slate-200 text-sm">{item.task}</p>
                      {(item.owner || item.due) && (
                        <div className="flex gap-3 mt-0.5">
                          {item.owner && <span className="text-xs text-slate-500">👤 {item.owner}</span>}
                          {item.due && <span className="text-xs text-slate-500">📅 {item.due}</span>}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Transcript preview */}
          <details className="group">
            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition-colors select-none">
              Show original transcript
            </summary>
            <div className="mt-2 p-3 bg-slate-900/50 rounded-lg border border-white/5 max-h-40 overflow-y-auto">
              <p className="text-slate-500 text-xs font-mono leading-relaxed whitespace-pre-wrap">
                {note.transcript_text}
              </p>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default function NoteHistoryClient({ notes }: Props) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-slate-600" />
        </div>
        <p className="text-slate-400 font-medium">No meeting notes yet</p>
        <p className="text-slate-600 text-sm mt-1">Paste a transcript above and hit Generate to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  )
}
