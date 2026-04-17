"use client";

import Link from "next/link";
import { FiHeart } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-2xl text-amber-400 mb-3">SnapWed</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Превращаем каждого гостя в фотографа. Сотни живых моментов с вашей свадьбы.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Продукт</h4>
            <ul className="space-y-2">
              {[
                { label: "Как работает", href: "#how-it-works" },
                { label: "Возможности", href: "#features" },
                { label: "Цены", href: "#pricing" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Аккаунт</h4>
            <ul className="space-y-2">
              {[
                { label: "Войти", href: "/login" },
                { label: "Регистрация", href: "/register" },
                { label: "Дашборд", href: "/dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Поддержка</h4>
            <ul className="space-y-2">
              {[
                { label: "Telegram", href: "https://t.me/snapwed" },
                { label: "Instagram", href: "https://instagram.com/snapwed" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-gray-400 hover:text-white text-sm transition-colors" target="_blank" rel="noopener">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SnapWed. Все права защищены.
          </p>
          <p className="text-gray-600 text-xs flex items-center gap-1.5">
            Made with <FiHeart className="w-3.5 h-3.5 text-rose-400" /> for couples in love
          </p>
        </div>
      </div>
    </footer>
  );
}
