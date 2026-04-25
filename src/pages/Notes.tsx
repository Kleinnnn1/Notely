import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNotes } from "../hooks/useNotes";
import { useSync } from "../hooks/useSync";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";
import StatusBar from "../components/StatusBar";

export default function Notes() {
  const [userId, setUserId] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { notes, loading, saveNote, deleteNote, loadNotes } = useNotes(userId);
  useSync(userId, loadNotes);

  // Get current user
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    });
  }, []);

  function handleSelectNote(note: any) {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  }

  function handleNewNote() {
    setSelectedNote(null);
    setTitle("");
    setContent("");
  }

  async function handleSave() {
    if (!title && !content) return;

    const saved = await saveNote({
      id: selectedNote?.id,
      title,
      content,
    });

    setSelectedNote(saved);
  }

  async function handleDelete() {
    if (!selectedNote) return;
    await deleteNote(selectedNote.id);
    handleNewNote();
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-72 border-r flex flex-col">
        <NoteList
          notes={notes}
          selectedId={selectedNote?.id}
          onSelect={handleSelectNote}
          onNewNote={handleNewNote}
        />
        <button
          onClick={handleLogout}
          className="m-4 text-sm text-gray-400 hover:text-red-400 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Editor area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <>
          {/* Title + actions */}
          <div className="flex items-center gap-3 px-6 pt-6 pb-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="flex-1 text-2xl font-bold text-gray-800 focus:outline-none placeholder-gray-300"
            />
            <button
              onClick={handleSave}
              disabled={!userId}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {userId ? "Save" : "Loading..."}
            </button>
            {selectedNote && (
              <button
                onClick={handleDelete}
                className="bg-red-500 px-3 py-1.5 rounded-lg text-sm hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>  

          {/* Editor */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {!selectedNote && !title && !content ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-2">
                <span className="text-5xl">📝</span>
                <p className="text-sm">
                  Click <strong>+ New</strong> and start typing
                </p>
              </div>
            ) : (
              <NoteEditor
                key={selectedNote?.id ?? "new"}
                content={content}
                onChange={setContent}
              />
            )}
          </div>
        </>
      </div>

      <StatusBar />
    </div>
  );
}
