import {
  Bot,
  Clock3,
  House,
  LogOut,
  MessageSquarePlus,
  Search,
  Settings,
} from 'lucide-react'

const navigation = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'new-chat', label: 'New Chat', icon: MessageSquarePlus },
  { id: 'history', label: 'Chat History', icon: Clock3 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

function ChatSidebar({ activeView, conversations, onViewChange, onSelectConversation, onLogout }) {
  function formatTime(value) {
    if (!value) return ''
    return new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date(value))
  }

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-[#17263a] bg-[#0b1725] px-3 py-5 max-[640px]:w-[76px] max-[640px]:px-2">
      <div className="flex items-center gap-2 px-2 text-sm font-bold tracking-tight text-[#eef4ff] max-[640px]:justify-center max-[640px]:px-0">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#1b2e4c] text-[#9bb3ff]"><Bot size={16} /></span>
        <span className="max-[640px]:hidden">Chat<span className="text-[#7371ff]">AI</span></span>
      </div>

      <div className="mt-9 flex items-center justify-between px-2 text-[#71829b]">
        <span className="text-[10px] font-semibold uppercase tracking-[.18em] max-[640px]:hidden">Workspace</span>
        <Search size={15} />
      </div>

      <nav className="mt-3 space-y-1" aria-label="Chat navigation">
        {navigation.map(({ id, label, icon: Icon }) => (
          <button
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-xs font-medium transition max-[640px]:justify-center max-[640px]:px-0 ${activeView === id ? 'bg-[#203b84] text-white shadow-[0_5px_16px_rgba(50,78,190,.2)]' : 'text-[#91a0b5] hover:bg-[#13263b] hover:text-white'}`}
            key={id}
            type="button"
            onClick={() => onViewChange(id)}
            title={label}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span className="max-[640px]:hidden">{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-8 min-h-0 max-[640px]:hidden">
        <p className="px-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#71829b]">Recent chats</p>
        <div className="mt-2 max-h-40 space-y-1 overflow-y-auto pr-1">
          {conversations.length === 0 && <p className="px-2 py-2 text-[10px] text-[#647891]">No conversations yet</p>}
          {conversations.slice(0, 8).map((conversation) => <button className="flex w-full items-center justify-between gap-2 rounded px-2 py-2 text-left text-[11px] text-[#91a0b5] transition hover:bg-[#13263b] hover:text-white" key={conversation._id} type="button" onClick={() => onSelectConversation(conversation)} title={conversation.title}><span className="truncate">{conversation.title}</span><time className="shrink-0 text-[9px] text-[#647891]">{formatTime(conversation.updatedAt)}</time></button>)}
        </div>
      </div>

      <div className="mt-auto border-t border-[#17263a] pt-4">
        <div className="flex items-center gap-2 px-2 max-[640px]:justify-center max-[640px]:px-0">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#747dff] text-xs font-bold text-white">D</div>
          <div className="min-w-0 max-[640px]:hidden"><p className="truncate text-[11px] font-semibold text-[#e5ebf5]">Divya</p><p className="truncate text-[9px] text-[#7d8da5]">divya@example.com</p></div>
        </div>
        <button className="mt-4 flex w-full items-center gap-3 px-2 text-[11px] font-medium text-[#8c9bb0] transition hover:text-white max-[640px]:justify-center" type="button" onClick={onLogout} title="Logout"><LogOut size={14} /><span className="max-[640px]:hidden">Logout</span></button>
      </div>
    </aside>
  )
}

export default ChatSidebar
