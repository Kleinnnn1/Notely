import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
      toast.success("Back online — syncing notes", { id: "network" });
    }

    function handleOffline() {
      setIsOnline(false);
      toast("Offline — saving locally", {
        id: "network",
        icon: "📴",
        style: {
          background: "#374151",
          color: "#fff",
        },
      });
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Small persistent indicator in corner
  return (
    <div
      className={`fixed bottom-4 left-4 flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
        isOnline ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      {isOnline ? "Online" : "Offline"}
    </div>
  );
}
