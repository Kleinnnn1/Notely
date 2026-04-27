import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        navigate("/notes");
      }
    });
  }, []);

  function validateEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validate() {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirm) {
      newErrors.confirm = "Please confirm your password";
    } else if (password !== confirm) {
      newErrors.confirm = "Passwords do not match";
    }

    return newErrors;
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        setErrors({ email: "This email is already registered" });
      } else {
        setErrors({ general: error.message });
      }
    } else {
      setRegistered(true);
    }

    setLoading(false);
  }

  // Success screen
  if (registered) {
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
          </div>

          <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl shadow-[6px_6px_0px_#1a1a1a] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#B8E8E0] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] flex items-center justify-center text-2xl mx-auto mb-4">
              ✉️
            </div>
            <h2 className="text-2xl font-black text-[#1a1a1a] mb-2">
              Check your email
            </h2>
            <p className="text-sm text-[#888] mb-2">
              We sent a confirmation link to
            </p>
            <p className="text-sm font-bold text-[#1a1a1a] mb-6">{email}</p>
            <p className="text-xs text-[#888] mb-6">
              Click the link in the email to activate your account then sign in.
            </p>
            <Link
              to="/login"
              className="block w-full bg-[#1a1a1a] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#333] shadow-[3px_3px_0px_#888] active:shadow-none transition-all text-center"
            >
              Go to Sign in →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center">
          <div className="flex justify-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#F5E6C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[-8deg]" />
            <div className="w-10 h-10 rounded-xl bg-[#B8E8E0] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a]" />
            <div className="w-10 h-10 rounded-xl bg-[#F5C8C8] border-2 border-[#1a1a1a] shadow-[3px_3px_0px_#1a1a1a] rotate-[8deg]" />
          </div>
          <h1 className="text-4xl font-black text-[#1a1a1a] mb-2">Notely</h1>
        </div>

        <div className="bg-white border-2 border-[#1a1a1a] rounded-2xl shadow-[6px_6px_0px_#1a1a1a] p-8">
          <h2 className="text-2xl font-black text-[#1a1a1a] mb-6">
            Create account
          </h2>

          {errors.general && (
            <div className="bg-[#F5C8C8] border-2 border-[#1a1a1a] rounded-xl px-4 py-2 text-sm text-[#1a1a1a] mb-4">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-bold text-[#1a1a1a] mb-1 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
                  errors.email
                    ? "border-red-400 bg-red-50"
                    : "border-[#1a1a1a] focus:bg-[#F5E6C8]"
                }`}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-[#1a1a1a] mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-[#1a1a1a] focus:bg-[#F5E6C8]"
                }`}
              />
              {password.length > 0 && (
                <div className="mt-1.5 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 2
                          ? password.length < 8
                            ? "bg-red-400"
                            : "bg-green-400"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
              )}
              {errors.password ? (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.password}
                </p>
              ) : (
                <p className="text-xs text-[#888] mt-1">
                  Must be at least 8 characters
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-bold text-[#1a1a1a] mb-1 block">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (errors.confirm)
                    setErrors((prev) => ({ ...prev, confirm: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-colors ${
                  errors.confirm
                    ? "border-red-400 bg-red-50"
                    : confirm && confirm === password
                      ? "border-green-400 bg-green-50"
                      : "border-[#1a1a1a] focus:bg-[#F5E6C8]"
                }`}
              />
              {errors.confirm && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.confirm}
                </p>
              )}
              {!errors.confirm && confirm && confirm === password && (
                <p className="text-xs text-green-500 mt-1 font-medium">
                  Passwords match ✓
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#1a1a1a] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#333] disabled:opacity-50 shadow-[3px_3px_0px_#888] active:shadow-none active:translate-y-0.5 transition-all mt-2"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>
        </div>

        <p className="text-sm text-[#888] text-center mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-[#1a1a1a] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
