"use client";

import { useState } from "react";
import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: { month: "$0", year: "$0" },
    description: "Для пробы",
    features: ["1 свадьба", "До 20 гостей", "До 100 фото", "3 задания", "Базовая галерея"],
    missing: ["Живая галерея", "Слайдшоу", "Поддержка"],
    cta: "Начать бесплатно",
    href: "/register",
    highlight: false,
  },
  {
    name: "Starter",
    price: { month: "$19", year: "$15" },
    description: "Для большинства",
    features: ["1 свадьба", "До 100 гостей", "До 1000 фото", "15 заданий", "Живая галерея", "Email поддержка"],
    missing: ["Слайдшоу"],
    cta: "Выбрать Starter",
    href: "/register",
    highlight: true,
    badge: "Популярный",
  },
  {
    name: "Premium",
    price: { month: "$49", year: "$39" },
    description: "Для крупных свадеб",
    features: ["Неограничено свадеб", "До 500 гостей", "До 5000 фото", "∞ заданий", "Живая галерея", "Слайдшоу", "Приоритетная поддержка"],
    missing: [],
    cta: "Выбрать Premium",
    href: "/register",
    highlight: false,
  },
];

export default function Pricing() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="bg-dark-bg py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Простые <span className="text-gold-400 italic">цены</span>
          </h2>
          <p className="text-gray-400 font-sans text-lg mb-6">Платите за свадьбу, не за подписку</p>

          <div className="inline-flex items-center gap-3 bg-dark-card rounded-xl p-1 border border-white/5">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-lg font-sans text-sm transition-colors ${!yearly ? "bg-gold-400 text-dark-bg font-semibold" : "text-gray-400"}`}
            >
              За свадьбу
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-lg font-sans text-sm transition-colors ${yearly ? "bg-gold-400 text-dark-bg font-semibold" : "text-gray-400"}`}
            >
              Годовой (−20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 border transition-transform hover:-translate-y-1 ${
                plan.highlight
                  ? "border-gold-400 bg-dark-card shadow-xl shadow-gold-400/10"
                  : "border-white/5 bg-dark-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-400 text-dark-bg text-xs font-semibold px-3 py-1 rounded-full font-sans">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="font-display text-white text-xl mb-1">{plan.name}</h3>
              <p className="text-gray-500 font-sans text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-display text-gold-400">
                  {yearly ? plan.price.year : plan.price.month}
                </span>
                {plan.name !== "Free" && (
                  <span className="text-gray-500 font-sans text-sm ml-1">/свадьба</span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-sans text-gray-300">
                    <Check size={14} className="text-gold-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm font-sans text-gray-600">
                    <span className="w-3.5 h-3.5 flex items-center justify-center text-gray-700 flex-shrink-0">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 rounded-xl font-semibold font-sans transition-colors ${
                  plan.highlight
                    ? "bg-gold-400 hover:bg-gold-600 text-dark-bg"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
