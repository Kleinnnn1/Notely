import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface NoteEditorProps {
  content?: string
  onChange?: (content: string) => void
}

export default function NoteEditor({ content = '', onChange }: NoteEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    }
  })

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50">
        <button
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBold().run() }}
          className={`px-2 py-1 rounded text-sm font-bold hover:bg-gray-200 transition-colors ${
            editor?.isActive('bold') ? 'bg-gray-200 text-blue-500' : 'text-gray-600'
          }`}
        >
          B
        </button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleItalic().run() }}
          className={`px-2 py-1 rounded text-sm italic hover:bg-gray-200 transition-colors ${
            editor?.isActive('italic') ? 'bg-gray-200 text-blue-500' : 'text-gray-600'
          }`}
        >
          I
        </button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleStrike().run() }}
          className={`px-2 py-1 rounded text-sm line-through hover:bg-gray-200 transition-colors ${
            editor?.isActive('strike') ? 'bg-gray-200 text-blue-500' : 'text-gray-600'
          }`}
        >
          S
        </button>

        <div className="w-px bg-gray-300 mx-1" />

        <button
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleBulletList().run() }}
          className={`px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors ${
            editor?.isActive('bulletList') ? 'bg-gray-200 text-blue-500' : 'text-gray-600'
          }`}
        >
          • List
        </button>
        <button
          onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().toggleOrderedList().run() }}
          className={`px-2 py-1 rounded text-sm hover:bg-gray-200 transition-colors ${
            editor?.isActive('orderedList') ? 'bg-gray-200 text-blue-500' : 'text-gray-600'
          }`}
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-[300px] prose max-w-none"
      />
    </div>
  )
}