import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import ChatHome from '../components/chat/ChatHome'
import ChatSidebar from '../components/chat/ChatSidebar'

function ChatPage() {
  const { onLogout } = useOutletContext()
  const [activeView, setActiveView] = useState('home')
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [newChatKey, setNewChatKey] = useState(0)

  useEffect(() => {
    async function loadConversations() {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat/conversations`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('chatbot_token')}` },
      })
      if (response.ok) {
        const data = await response.json()
        setConversations(data.conversations)
      }
    }

    loadConversations().catch(() => {})
  }, [])

  function startNewChat() {
    setSelectedConversation(null)
    setNewChatKey((key) => key + 1)
    setActiveView('new-chat')
  }

  function selectConversation(conversation) {
    setSelectedConversation(conversation)
    setActiveView('home')
  }

  function handleConversationCreated(conversation) {
    setSelectedConversation(conversation)
    setConversations((current) => [conversation, ...current.filter(({ _id }) => _id !== conversation._id)])
  }

  return (
    <main className="flex min-h-screen bg-[#07111c] text-white">
      <ChatSidebar activeView={activeView} conversations={conversations} onViewChange={(view) => view === 'new-chat' ? startNewChat() : setActiveView(view)} onSelectConversation={selectConversation} onLogout={onLogout} />
      <ChatHome activeView={activeView} selectedConversation={selectedConversation} newChatKey={newChatKey} onConversationCreated={handleConversationCreated} />
    </main>
  )
}

export default ChatPage
