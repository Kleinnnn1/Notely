const CARD_COLORS = ['#F5E6C8', '#B8E8E0', '#F5C8C8']

interface Note {
  id: string
  title: string
  content: string
  updated_at: string
  synced?: boolean
}

interface NoteListProps {
  notes: Note[]
  selectedId?: string
  onSelect: (note: Note) => void
  onNewNote: () => void
}

export default function NoteList({ notes, selectedId, onSelect, onNewNote }: NoteListProps) {
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  function stripHtml(html: string) {
    return html
      .replace(/<\/li>/g, ', ')
      .replace(/<br\s*\/?>/g, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/,\s*$/, '')
      .trim()
      .slice(0, 60) || 'No content'
  }

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="p-4 border-b-2 border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-2xl font-black text-[#1a1a1a]">Notely</h1>
          <button
            onClick={onNewNote}
            className="bg-[#1a1a1a] text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#333] shadow-[2px_2px_0px_#888] active:shadow-none active:translate-y-0.5 transition-all"
          >
            + New
          </button>
        </div>
        <p className="text-xs text-[#888]">your personal notes</p>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {notes.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-20 gap-3">
            <div className="flex gap-1">
              <div className="w-8 h-8 rounded-lg bg-[#F5E6C8] border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] rotate-[-8deg]" />
              <div className="w-8 h-8 rounded-lg bg-[#B8E8E0] border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a]" />
              <div className="w-8 h-8 rounded-lg bg-[#F5C8C8] border-2 border-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] rotate-[8deg]" />
            </div>
            <p className="text-xs text-[#888] font-medium">No notes yet</p>
          </div>
        )}

        {notes.map((note, index) => {
          const color = CARD_COLORS[index % CARD_COLORS.length]
          const isSelected = selectedId === note.id

          return (
            <div
              key={note.id}
              onClick={() => onSelect(note)}
              className="rounded-xl border-2 border-[#1a1a1a] cursor-pointer transition-all active:translate-y-0.5"
              style={{
                backgroundColor: color,
                boxShadow: isSelected ? '2px 2px 0px #1a1a1a' : '4px 4px 0px #1a1a1a',
                transform: isSelected ? 'translateY(2px)' : undefined
              }}
            >
              {/* Card header */}
              <div className="px-3 py-2 border-b-2 border-[#1a1a1a] flex items-center justify-between">
                <h3 className="font-black text-[#1a1a1a] text-sm truncate">
                  {note.title || 'Untitled'}
                </h3>
                <span className={`text-xs px-1.5 py-0.5 rounded-full border border-[#1a1a1a] ml-2 shrink-0 ${
                  note.synced ? 'bg-white' : 'bg-[#1a1a1a] text-white'
                }`}>
                  {note.synced ? 'Synced' : 'Local'}
                </span>
              </div>
              {/* Card body */}
              <div className="px-3 py-2">
                <p className="text-xs text-[#444] truncate">{stripHtml(note.content)}</p>
                <p className="text-xs text-[#888] mt-1">{formatDate(note.updated_at)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}