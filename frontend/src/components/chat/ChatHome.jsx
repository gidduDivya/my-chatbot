import { useEffect, useState } from 'react'
import { ArrowUp, Code2, Lightbulb, MessageSquare, PencilLine, Search } from 'lucide-react'

import { TOKEN_KEY } from '../AuthCheckWrapper'
import { useToast } from '../Toast'

const promptCards = [
  { icon: MessageSquare, title: 'Explain a concept', description: 'Get simple explanations' },
  { icon: PencilLine, title: 'Write something', description: 'Emails, blogs, etc.' },
  { icon: Code2, title: 'Code help', description: 'Debug & improve' },
  { icon: Lightbulb, title: 'Creative ideas', description: 'For work or personal' },
]

function ChatHome({ activeView, selectedConversation, newChatKey, onConversationCreated }) {
  const [message, setMessage] = useState('')
  const [conversationId, setConversationId] = useState(null)
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    if (selectedConversation) {
      setConversationId(selectedConversation._id)
      setMessages(selectedConversation.messages || [])
      setMessage('')
    }
  }, [selectedConversation])

  useEffect(() => {
    if (newChatKey) {
      setConversationId(null)
      setMessages([])
      setMessage('')
    }
  }, [newChatKey])

  function formatTime(value) {
    if (!value) return ''
    return new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
  }

  const viewCopy = {
    history: ['Chat History', 'Your recent conversations will appear here.'],
    settings: ['Settings', 'Personalize your ChatAI experience.'],
  }

  async function sendMessage(event) {
    event.preventDefault()
    const trimmedMessage = message.trim()
    if (!trimmedMessage) return
    setIsSending(true)
    setMessage('')

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem(TOKEN_KEY)}`,
        },
        body: JSON.stringify({ message: trimmedMessage, conversationId }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Unable to send message')
      setConversationId(data.conversationId)
      onConversationCreated(data.conversation)
      setMessages(data.conversation?.messages || [{ role: 'user', content: trimmedMessage }, { role: 'assistant', content: data.message }])
    } catch (error) {
      setMessage(trimmedMessage)
      showToast(error.message, 'error')
    } finally {
      setIsSending(false)
    }
  }

  if (activeView !== 'home' && activeView !== 'new-chat') {
    const [title, description] = viewCopy[activeView]
    return <section className="flex flex-1 flex-col px-8 py-7 sm:px-12"><div className="flex items-center justify-between"><div><p className="text-[11px] font-semibold uppercase tracking-[.2em] text-[#71829b]">ChatAI workspace</p><h1 className="mt-2 text-2xl font-semibold text-[#edf3fc]">{title}</h1><p className="mt-2 text-sm text-[#8494aa]">{description}</p></div><Search size={18} className="text-[#8292aa]" /></div></section>
  }

  return (
    <section className="relative flex min-w-0 flex-1 flex-col overflow-hidden px-8 py-7 sm:px-12">
      <div className="flex items-center justify-end text-[#8392a8]"><Search size={18} /></div>
      <div className="mx-auto flex w-full max-w-[670px] flex-1 flex-col justify-center pb-8">
        <div className="mb-8"><h1 className="text-2xl font-semibold tracking-[-.04em] text-[#eef4ff] sm:text-[27px]">Hello Divya <span aria-hidden="true">👋</span></h1><p className="mt-2 text-sm text-[#a3afbf]">How can I help you today?</p></div>
        <form className="relative" onSubmit={sendMessage}>
          <input className="h-12 w-full rounded-2xl border border-[#29436c] bg-[#172d4d] px-4 pr-14 text-xs text-[#eff5ff] outline-none placeholder:text-[#93a4bd] focus:border-[#516fff] focus:ring-2 focus:ring-[#516fff]/20" value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." aria-label="Type your message" />
          <button className="absolute right-1.5 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[#625bff] text-white shadow-[0_0_16px_rgba(98,91,255,.55)] transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50" type="submit" aria-label="Send message" disabled={isSending}><ArrowUp size={17} /></button>
        </form>
        {messages.length > 0 && <div className="mt-4 space-y-2">{messages.slice(-6).map(({ role, content, createdAt }, index) => <div className={`rounded-lg border p-3 text-xs ${role === 'assistant' ? 'border-[#293f68] bg-[#10243a] text-[#d8e5f6]' : 'ml-8 border-[#334d85] bg-[#182d53] text-[#bdcbdf]'}`} key={`${role}-${index}`}><div>{content}</div><time className="mt-2 block text-[9px] text-[#71839e]">{formatTime(createdAt) || 'Just now'}</time></div>)}</div>}
        {messages.length === 0 && !message && <div className="mt-9"><p className="mb-3 text-[11px] font-semibold text-[#d8e2f1]">Quick Prompts</p><div className="grid grid-cols-2 gap-2 sm:gap-3">{promptCards.map(({ icon: Icon, title, description }) => <button className="flex items-center gap-3 rounded-lg border border-[#1d3450] bg-[#10243a] px-3 py-3 text-left transition hover:border-[#3c5aa1] hover:bg-[#152d49]" key={title} type="button" onClick={() => setMessage(title)}><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#1a3154] text-[#bac8ff]"><Icon size={15} /></span><span className="min-w-0"><strong className="block truncate text-[10px] font-semibold text-[#e0e8f5]">{title}</strong><small className="mt-0.5 block truncate text-[9px] text-[#8497b1]">{description}</small></span></button>)}</div></div>}
      </div>
    </section>
  )
}

export default ChatHome
