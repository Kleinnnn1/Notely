import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/notes");
      }
    });

    // Pre-fill email if remembered
    const savedEmail = localStorage.getItem("notely-remember-email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (remember) {
      localStorage.setItem("notely-remember-email", email);
    } else {
      localStorage.removeItem("notely-remember-email");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      navigate("/notes");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5E6C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[-8deg]" />
            <div className="w-10 h-10 rounded-xl bg-[#B8E8E0] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]" />
            <div className="w-10 h-10 rounded-xl bg-[#F5C8C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[8deg]" />
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a]">Notely</h1>
          <p className="text-[#888] text-sm mt-1">level up your note taking</p>
        </div>

        <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl shadow-[6px_6px_0px_#1a1a1a] p-8">
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-6">Sign in</h2>

          {error && (
            <div className="bg-[#F5C8C8] border-2 border-[#1a1a1a] rounded-xl px-4 py-2 text-sm text-[#1a1a1a] mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-bold text-[#1a1a1a] mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full border-2 border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-[#F5E6C8] transition-colors"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-[#1a1a1a] mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border-2 border-[#1a1a1a] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:bg-[#F5E6C8] transition-colors"
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div
                onClick={() => setRemember(!remember)}
                className={`w-5 h-5 rounded-md border-2 border-[#1a1a1a] flex items-center justify-center transition-colors shrink-0 ${
                  remember ? "bg-[#1a1a1a]" : "bg-white"
                }`}
              >
                {remember && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4L3.5 6.5L9 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-sm font-medium text-[#444]">
                Remember my email
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1a1a1a] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#333] disabled:opacity-50 shadow-[3px_3px_0px_#888] active:shadow-none active:translate-y-0.5 transition-all"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>
        </div>

        <p className="text-sm text-[#888] text-center mt-4">
          No account?{" "}
          <Link
            to="/register"
            className="font-bold text-[#1a1a1a] hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
