'use server'

import { createClient } from '@/lib/supabase/server'
import { groq, GROQ_MODEL } from '@/lib/groq'
import { revalidatePath } from 'next/cache'
import type { GenerateResult } from '@/types'

const FREE_DAILY_LIMIT = 3

export async function generateNotes(transcript: string): Promise<{ data?: GenerateResult & { id: string }; error?: string }> {
  const supabase = createClient()

  // 1. Auth check
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) return { error: 'You must be signed in.' }

  if (!transcript || transcript.trim().length < 20) {
    return { error: 'Please provide a transcript of at least 20 characters.' }
  }

  // 2. Fetch profile (plan)
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  // 3. Usage gate for free users
  if (plan === 'free') {
    const today = new Date().toISOString().split('T')[0]
    const { data: usage } = await supabase
      .from('usage_counters')
      .select('count')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single()

    const currentCount = usage?.count ?? 0
    if (currentCount >= FREE_DAILY_LIMIT) {
      return {
        error: `You've reached your free limit of ${FREE_DAILY_LIMIT} generations today. Upgrade to Pro for unlimited access.`,
      }
    }
  }

  // 4. Call Groq — NEVER client-side
  let parsed: GenerateResult
  try {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.3,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: `You are an expert meeting analyst. Given a meeting transcript, produce a concise summary and extract all action items.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):
{
  "summary": "A 2-4 sentence summary of the meeting.",
  "action_items": [
    { "task": "Description of action item", "owner": "Person responsible (optional)", "due": "Due date or timeframe (optional)" }
  ]
}

Rules:
- summary must be 2–4 sentences
- action_items is an array (can be empty if none found)
- Each action item must have "task"; "owner" and "due" are optional`,
        },
        {
          role: 'user',
          content: `Meeting transcript:\n\n${transcript.slice(0, 12000)}`,
        },
      ],
    })

    const content = completion.choices[0]?.message?.content ?? ''
    parsed = JSON.parse(content) as GenerateResult

    // Basic validation
    if (typeof parsed.summary !== 'string' || !Array.isArray(parsed.action_items)) {
      throw new Error('Invalid response shape from model')
    }
  } catch (err) {
    console.error('Groq error:', err)
    return { error: 'AI generation failed. Please try again.' }
  }

  // 5. Save to database
  const { data: note, error: insertError } = await supabase
    .from('meeting_notes')
    .insert({
      user_id: user.id,
      transcript_text: transcript.trim(),
      summary: parsed.summary,
      action_items: parsed.action_items,
    })
    .select('id')
    .single()

  if (insertError || !note) {
    console.error('Insert error:', insertError)
    return { error: 'Failed to save notes. Please try again.' }
  }

  // 6. Increment usage counter (upsert)
  const today = new Date().toISOString().split('T')[0]
  await supabase.rpc('increment_usage', { p_user_id: user.id, p_date: today })
    .catch(async () => {
      // Fallback if RPC not set up: manual upsert
      const { data: existing } = await supabase
        .from('usage_counters')
        .select('count')
        .eq('user_id', user.id)
        .eq('usage_date', today)
        .single()

      if (existing) {
        await supabase
          .from('usage_counters')
          .update({ count: existing.count + 1 })
          .eq('user_id', user.id)
          .eq('usage_date', today)
      } else {
        await supabase
          .from('usage_counters')
          .insert({ user_id: user.id, usage_date: today, count: 1 })
      }
    })

  revalidatePath('/dashboard')

  return {
    data: {
      id: note.id,
      ...parsed,
    },
  }
}

export async function deleteNote(noteId: string): Promise<{ error?: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('meeting_notes')
    .delete()
    .eq('id', noteId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard')
  return {}
}
