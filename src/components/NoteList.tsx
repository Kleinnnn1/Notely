interface Note {
  id: string;
  title: string;
  content: string;
  updated_at: string;
  synced?: boolean;
}

interface NoteListProps {
  notes: Note[];
  selectedId?: string;
  onSelect: (note: Note) => void;
  onNewNote: () => void;
}

export default function NoteList({
  notes,
  selectedId,
  onSelect,
  onNewNote,
}: NoteListProps) {
  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function stripHtml(html: string) {
    return (
      html
        .replace(/<\/li>/g, ", ")
        .replace(/<br\s*\/?>/g, " ")
        .replace(/<[^>]*>/g, "")
        .replace(/,\s*$/, "") 
        .trim()
        .slice(0, 60) || "No content"
    );
  }

  return (
    <div className="note-list flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Notely</h1>
        <button
          onClick={onNewNote}
          className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
        >
          + New
        </button>
      </div>

      {/* Notes */}
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 && (
          <p className="text-center text-gray-400 mt-10 text-sm">
            No notes yet
          </p>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelect(note)}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedId === note.id
                ? "bg-blue-50 border-l-4 border-l-blue-500"
                : ""
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-gray-800 truncate">
                {note.title || "Untitled"}
              </h3>
              {/* Sync indicator */}
              <span
                className={`text-xs ml-2 px-1.5 py-0.5 rounded-full ${
                  note.synced
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {note.synced ? "Synced" : "Local"}
              </span>
            </div>
            <p className="text-sm text-gray-400 truncate">
              {stripHtml(note.content)}
            </p>
            <p className="text-xs text-gray-300 mt-1">
              {formatDate(note.updated_at)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
