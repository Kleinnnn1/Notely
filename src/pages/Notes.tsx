import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { supabase } from "../lib/supabase";
import { useNotes } from "../hooks/useNotes";
import { useSync } from "../hooks/useSync";
import NoteList from "../components/NoteList";
import NoteEditor from "../components/NoteEditor";

type Tab = "notes" | "editor";

export default function Notes() {
  const [userId, setUserId] = useState("");
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("notes");

  const { notes, saveNote, deleteNote, loadNotes } = useNotes(userId);
  useSync(userId, () => {
    loadNotes();
    toast.success("Notes synced");
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
      }
    });

    function handleOnline() {
      setIsOnline(true);
      toast.success("Back online — syncing notes", { id: "network" });
    }

    function handleOffline() {
      setIsOnline(false);
      toast("Offline — saving locally", {
        id: "network",
        icon: "📴",
        style: { background: "#374151", color: "#fff" },
      });
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function handleSelectNote(note: any) {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
    setActiveTab("editor");
  }

  function handleNewNote() {
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setActiveTab("editor");
  }

  async function handleSave() {
    if (!title && !content) {
      toast.error("Please add a title or content");
      return;
    }

    const isNew = !selectedNote?.id;
    const saved = await saveNote({ id: selectedNote?.id, title, content });
    setSelectedNote(saved);
    toast.success(isNew ? "Note created" : "Note updated");
  }

  async function handleDelete() {
    if (!selectedNote) return;
    await deleteNote(selectedNote.id);
    setSelectedNote(null);
    setTitle("");
    setContent("");
    setActiveTab("notes");
    toast.success("Note deleted");
  }

  function handleLogout() {
    setShowLogoutModal(true);
  }

  async function confirmLogout() {
    try {
      await supabase.auth.signOut();
    } catch (e) {
    }

    localStorage.removeItem("notely_session");
    localStorage.removeItem("notely-remember-email");

    toast.success("Signed out");
    window.location.href = "/login";
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#fafafa]">
      <NoteList
        notes={notes}
        selectedId={selectedNote?.id}
        onSelect={handleSelectNote}
        onNewNote={handleNewNote}
      />
      <div className="p-4 border-t-2 border-[#1a1a1a] flex items-center justify-between gap-2">
        <div
          className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full shrink-0 ${
            isOnline
              ? "bg-green-100 text-green-600"
              : "bg-gray-100 text-gray-500"
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
              isOnline ? "bg-green-500" : "bg-gray-400"
            }`}
          />
          {isOnline ? "Online" : "Offline"}
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-bold bg-red-500 text-white px-4 py-2 rounded-xl shadow-[2px_2px_0px_#888] active:shadow-none active:translate-y-0.5 transition-all hover:bg-red-600 shrink-0"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  const editorContent = (
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 border-b-2 border-[#1a1a1a]">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="flex-1 text-xl md:text-3xl font-black text-[#1a1a1a] focus:outline-none placeholder-gray-200 bg-transparent min-w-0"
          />
          <button
            onClick={handleSave}
            disabled={!userId}
            className="bg-[#1a1a1a] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#333] disabled:opacity-50 shadow-[3px_3px_0px_#888] active:shadow-none active:translate-y-0.5 transition-all shrink-0"
          >
            {userId ? "Save" : "..."}
          </button>
          {selectedNote && (
            <button
              onClick={handleDelete}
              className="bg-[#F5C8C8] text-[#1a1a1a] px-3 py-2 rounded-xl text-sm font-bold border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] active:shadow-none active:translate-y-0.5 transition-all shrink-0"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        {!selectedNote && !title && !content ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="flex gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F5E6C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[-8deg]" />
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#B8E8E0] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]" />
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#F5C8C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[8deg]" />
            </div>
            <p className="text-[#888] text-sm font-medium text-center">
              Click <strong className="text-[#1a1a1a]">+ New</strong> and start
              typing
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
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      <div className="hidden md:flex flex-1 overflow-hidden">
        <div className="w-72 border-r-2 border-[#1a1a1a] flex flex-col">
          {sidebarContent}
        </div>
        <div className="flex-1 overflow-hidden">{editorContent}</div>
      </div>

      <div className="flex md:hidden flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-hidden">
          {activeTab === "notes" ? sidebarContent : editorContent}
        </div>

        <div className="border-t-2 border-[#1a1a1a] flex bg-[#fafafa]">
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === "notes"
                ? "bg-[#1a1a1a] text-white"
                : "text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Notes {notes.length > 0 && `(${notes.length})`}
          </button>
          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-3 text-sm font-bold transition-colors border-l-2 border-[#1a1a1a] ${
              activeTab === "editor"
                ? "bg-[#1a1a1a] text-white"
                : "text-[#888] hover:text-[#1a1a1a]"
            }`}
          >
            Editor
          </button>
        </div>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl shadow-[6px_6px_0px_#1a1a1a] p-6 w-full max-w-sm mx-4">
            <h2 className="text-xl font-black text-[#1a1a1a] text-center mb-2">
              Sign out?
            </h2>
            <p className="text-sm text-[#888] text-center mb-6">
              {!isOnline
                ? "You're offline. Unsynced notes may be lost if you sign out."
                : "Are you sure you want to sign out of Notely?"}
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={confirmLogout}
                className="w-full py-3 text-sm font-bold bg-red-500 text-white rounded-xl border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] active:shadow-none active:translate-y-0.5 transition-all hover:bg-red-600"
              >
                Sign out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 text-sm font-bold text-[#888] rounded-xl border-2 border-[#e0e0e0] hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
