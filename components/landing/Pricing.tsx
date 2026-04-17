"use client";

import { useState } from "react";
import Link from "next/link";
import { FiCheck } from "react-icons/fi";

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
    <section id="pricing" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Простые <span className="text-amber-500 italic">цены</span>
          </h2>
          <p className="text-gray-500 text-lg mb-6">Платите за свадьбу, не за подписку</p>

          <div className="inline-flex items-center gap-3 bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${!yearly ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            >
              За свадьбу
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${yearly ? "bg-gray-900 text-white shadow-md" : "text-gray-500 hover:text-gray-700"}`}
            >
              Годовой (−20%)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-6 transition-all hover:-translate-y-1 ${
                plan.highlight
                  ? "bg-white border-2 border-amber-400 shadow-xl"
                  : "bg-white border border-gray-200 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-gray-900 text-xs font-semibold px-3 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              <h3 className="font-display text-gray-900 text-xl mb-1">{plan.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{plan.description}</p>

              <div className="mb-6">
                <span className="text-4xl font-display text-gray-900">
                  {yearly ? plan.price.year : plan.price.month}
                </span>
                {plan.name !== "Free" && (
                  <span className="text-gray-400 text-sm ml-1">/свадьба</span>
                )}
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <FiCheck size={16} className="text-amber-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="w-4 h-4 flex items-center justify-center text-gray-300 flex-shrink-0">—</span>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3.5 rounded-xl font-medium transition-all ${
                  plan.highlight
                    ? "bg-gray-900 hover:bg-gray-800 text-white"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
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
