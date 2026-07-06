import Groq from 'groq-sdk'

export const GROQ_MODEL = 'llama-3.3-70b-versatile'

// Lazily initialized — only constructed on first request, not at build time
let _groq: Groq | null = null

export function getGroq(): Groq {
  if (!_groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('Missing GROQ_API_KEY environment variable')
    }
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return _groq
}

// Proxy for backward-compatible `groq.chat.completions.create(...)` calls
export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    return (getGroq() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
