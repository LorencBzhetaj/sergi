"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Logo } from "@/components/layout/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.ok) {
      router.push("/admin");
    } else {
      setError("Email ose fjalëkalimi i gabuar.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo className="justify-center" />
          <p className="text-xs text-neutral-500 tracking-widest mt-3">PANELI ADMINISTRATIV</p>
        </div>

        <div className="bg-white border border-neutral-200 p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 border border-[#C9A84C] flex items-center justify-center">
              <Lock className="h-5 w-5 text-[#C9A84C]" />
            </div>
          </div>
          <h1 className="text-center text-sm font-bold tracking-widest mb-6">HYRJA NË PANEL</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5">EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@bogadnistore.com"
                className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest mb-1.5">FJALËKALIMI</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-neutral-200 px-4 py-3 text-sm focus:outline-none focus:border-black pr-10"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white text-xs font-bold tracking-widest py-4 hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Duke hyrë..." : "HYRJA"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
