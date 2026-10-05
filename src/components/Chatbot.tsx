import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { MessageCircle, Send, X } from 'lucide-react'
import { answerFor, greeting, intents, quickReplies } from '@/data/faq'

interface Msg {
  id: number
  from: 'bot' | 'user'
  text: string
}

export function Chatbot() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, from: 'bot', text: greeting }])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const log = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const idRef = useRef(1)
  const reduce = useReducedMotion()

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [msgs, typing, reduce])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = (text: string) => {
    const q = text.trim()
    if (!q) return
    setMsgs((m) => [...m, { id: idRef.current++, from: 'user', text: q }])
    setTyping(true)
    const { text: reply } = answerFor(q)
    window.setTimeout(() => {
      setMsgs((m) => [...m, { id: idRef.current++, from: 'bot', text: reply }])
      setTyping(false)
    }, reduce ? 0 : 650)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    ask(input)
    setInput('')
  }

  const chips = quickReplies.map((id) => intents.find((i) => i.id === id)).filter((c) => c != null)

  return (
    <div className="chat">
      <AnimatePresence>
        {open && (
          <motion.div
            className="chat__panel"
            role="dialog"
            aria-labelledby="chat-title"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            <div className="chat__head">
              <img src="/img/logo-xs.webp" alt="" width={36} height={36} />
              <div>
                <strong id="chat-title">Café Maya</strong>
                <span>Ask us anything</span>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
            </div>

            <div className="chat__log" ref={log} role="log" aria-live="polite">
              {msgs.map((m) => (
                <motion.p key={m.id} className={`bubble bubble--${m.from}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                  {m.text}
                </motion.p>
              ))}
              {typing && <p className="bubble bubble--bot bubble--typing" aria-label="Typing"><i /><i /><i /></p>}
            </div>

            <div className="chat__chips" role="group" aria-label="Suggested questions">
              {chips.map((c) => (
                <button key={c.id} onClick={() => ask(c.label)}>{c.chip ?? c.label}</button>
              ))}
            </div>

            <form className="chat__form" onSubmit={submit}>
              <label className="sr-only" htmlFor="chat-input">Type your question</label>
              <input id="chat-input" ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Hours, menu, delivery…" autoComplete="off" />
              <button type="submit" aria-label="Send" disabled={!input.trim()}><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button className="chat__fab" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close chat' : 'Open chat assistant'}>
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  )
}
