"use client";

import { FiStar } from "react-icons/fi";

const testimonials = [
  {
    name: "Малика Рашидова",
    city: "Ташкент",
    rating: 5,
    text: "SnapWed — это было лучшее решение для нашей свадьбы! Гости фотографировали со всех сторон, и у нас теперь 400+ живых фото. Обычный фотограф никогда бы не поймал столько моментов.",
  },
  {
    name: "Азиз Каримов",
    city: "Алматы",
    rating: 5,
    text: "Поставили QR на каждый стол — и к концу вечера уже 250 фото! Жена в восторге. Задания особенно понравились — гости соревновались кто сделает лучшее фото.",
  },
  {
    name: "Диана Сейткали",
    city: "Бишкек",
    rating: 5,
    text: "Просто и удобно. Никаких приложений, гости просто сканируют QR с телефона. Даже бабушка справилась! Теперь советую всем кто готовится к свадьбе.",
  },
  {
    name: "Тимур Назаров",
    city: "Самарканд",
    rating: 5,
    text: "Брали план Starter и не пожалели. Живая галерея — это вообще огонь, гости видят фото друг друга в реальном времени и это создаёт такую атмосферу!",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Что говорят <span className="text-amber-500 italic">молодожёны</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <FiStar key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                  <span className="text-amber-600 font-medium">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
