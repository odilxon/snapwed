"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiHeart, FiMail, FiLock, FiUser, FiArrowRight } from "react-icons/fi";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl text-gray-900">SnapWed</span>
          </Link>

          <h1 className="text-3xl font-display text-gray-900 mb-2">С возвращением!</h1>
          <p className="text-gray-500 mb-8">Войдите чтобы управлять своими свадьбами</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="animate-pulse">Входим...</span>
              ) : (
                <>
                  Войти
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Нет аккаунта?{" "}
            <Link href="/register" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-400 via-amber-500 to-rose-400 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center">
            <FiHeart className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-display mb-4">SnapWed</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Каждый гость — ваш фотограф. Сотни живых моментов с вашей свадьбы.
          </p>
        </div>
      </div>
    </div>
  );
}
