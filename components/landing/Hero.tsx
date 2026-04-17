"use client";

import Link from "next/link";
import { FiArrowRight, FiHeart, FiCamera, FiStar } from "react-icons/fi";

export default function Hero() {
  return (
    <section className="min-h-screen bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5">
              <FiStar className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 text-sm font-medium">Свадебные фото нового поколения</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-gray-900 leading-tight">
              Каждый гость —<br />
              <span className="text-amber-500 italic">ваш фотограф</span>
            </h1>

            <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-lg">
              QR-код → гости фотографируют → вы получаете сотни живых моментов прямо на свадьбе. Без приложений. Без хлопот.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-8 py-4 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Начать бесплатно
                <FiArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium px-8 py-4 rounded-2xl transition-all"
              >
                Смотреть демо
              </Link>
            </div>

            <p className="text-gray-400 text-sm">
              Бесплатно для первой свадьбы · Без кредитной карты
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div
                className="absolute inset-0 blur-3xl opacity-20"
                style={{ background: "radial-gradient(circle, #D4A853, transparent 70%)" }}
              />
              <div className="relative w-72 bg-[#FFFBF8] rounded-[3rem] border border-gray-200 shadow-2xl overflow-hidden animate-float">
                <div className="h-44 bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-sm">
                    <FiHeart className="w-12 h-12 text-amber-500" />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-gray-900 text-xl mb-1">Свадьба Азиза и Малики</h3>
                  <p className="text-gray-400 text-sm mb-6">14 сентября 2025 · Ташкент</p>
                  <div className="bg-gray-900 text-white text-center py-4 rounded-2xl font-medium flex items-center justify-center gap-2">
                    <FiCamera className="w-5 h-5" />
                    Начать съёмку
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-1 text-sm text-gray-400">
                    <FiCamera className="w-4 h-4" />
                    <span>312 фото от 47 гостей</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: "10K+", label: "Свадеб" },
            { value: "500K+", label: "Фотографий" },
            { value: "99%", label: "Довольных" },
            { value: "4.9", label: "Рейтинг" },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 bg-gray-50 rounded-2xl">
              <div className="font-display text-3xl md:text-4xl text-gray-900 mb-1">{stat.value}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
