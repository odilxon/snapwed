"use client";

import { useState } from "react";
import Link from "next/link";
import { FiHeart, FiMail, FiLock, FiUser, FiArrowRight, FiCheck, FiInbox } from "react-icons/fi";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      if (error.message.includes("already") || error.message.includes("already exists")) {
        setError("Аккаунт с таким email уже существует. Попробуйте войти.");
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else if (data.user && data.session === null) {
      setSuccess(true);
      setEmailSent(email);
    } else {
      setSuccess(true);
      setEmailSent(email);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        {/* Left side - Decorative */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-400 via-amber-500 to-rose-400 items-center justify-center p-12">
          <div className="max-w-md text-center text-white">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center">
              <FiHeart className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-display mb-4">Почти готово!</h2>
            <p className="text-lg text-white/90 leading-relaxed">
              Проверьте вашу почту и подтвердите email для активации аккаунта.
            </p>
          </div>
        </div>

        {/* Right side - Success */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <FiInbox className="w-10 h-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-display text-gray-900 mb-4">Письмо отправлено!</h1>
            
            <p className="text-gray-600 mb-2">
              Мы отправили письмо с ссылкой для подтверждения на:
            </p>
            
            <p className="text-lg font-medium text-gray-900 mb-8">
              {emailSent}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-left">
              <p className="text-amber-800 text-sm">
                <strong>Не получили письмо?</strong>
                <br />
                Проверьте папку &laquo;Спам&raquo;. Ссылка действительна в течение 24 часов.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-3.5 rounded-xl transition-colors"
            >
              Перейти к входу
              <FiArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Decorative */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-amber-400 via-amber-500 to-rose-400 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <div className="w-24 h-24 mx-auto mb-8 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center">
            <FiHeart className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-display mb-4">Начните сегодня</h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            Бесплатно для первой свадьбы. Без кредитной карты.
          </p>
          <div className="space-y-3 text-left">
            {[
              "Без установки приложений",
              "QR-код для гостей",
              "Фото в реальном времени",
              "Realtime галерея",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <FiCheck className="w-4 h-4" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center">
              <FiHeart className="w-5 h-5 text-white" />
            </div>
            <span className="font-display text-2xl text-gray-900">SnapWed</span>
          </Link>

          <h1 className="text-3xl font-display text-gray-900 mb-2">Создайте аккаунт</h1>
          <p className="text-gray-500 mb-8">И начните собирать фото с вашей свадьбы</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ваше имя</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="Алия Каримова"
                />
              </div>
            </div>

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
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                  placeholder="Минимум 6 символов"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3.5 rounded-xl transition-colors"
            >
              {loading ? (
                <span className="animate-pulse">Создаём аккаунт...</span>
              ) : (
                <>
                  Создать аккаунт
                  <FiArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Уже есть аккаунт?{" "}
            <Link href="/login" className="text-amber-600 hover:text-amber-700 font-medium transition-colors">
              Войти
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
