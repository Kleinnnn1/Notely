import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface NoteEditorProps {
  content?: string;
  onChange?: (content: string) => void;
}

export default function NoteEditor({
  content = "",
  onChange,
}: NoteEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange?.(editor.getHTML());
    },
  });

  const btnClass = (active: boolean) =>
    `px-2 py-1 rounded-lg text-sm font-bold border-2 border-[#1a1a1a] transition-all ${
      active
        ? "bg-[#1a1a1a] text-white shadow-none"
        : "bg-white text-[#1a1a1a] shadow-[2px_2px_0px_#1a1a1a] hover:bg-[#F5E6C8]"
    }`;

  return (
    <div className="border-2 border-[#1a1a1a] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#1a1a1a]">
      {/* Toolbar */}
      <div className="flex gap-1.5 p-2 border-b-2 border-[#1a1a1a] bg-[#fafafa]">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleBold().run();
          }}
          className={btnClass(editor?.isActive("bold") ?? false)}
        >
          B
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleItalic().run();
          }}
          className={`${btnClass(editor?.isActive("italic") ?? false)} italic`}
        >
          I
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleStrike().run();
          }}
          className={`${btnClass(editor?.isActive("strike") ?? false)} line-through`}
        >
          S
        </button>

        <div className="w-px bg-[#1a1a1a] mx-1" />

        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleBulletList().run();
          }}
          className={btnClass(editor?.isActive("bulletList") ?? false)}
        >
          • List
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor?.chain().focus().toggleOrderedList().run();
          }}
          className={btnClass(editor?.isActive("orderedList") ?? false)}
        >
          1. List
        </button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="p-4 min-h-100 prose max-w-none bg-white"
      />
    </div>
  );
}
