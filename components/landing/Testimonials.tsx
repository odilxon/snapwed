const testimonials = [
  {
    name: "Малика Рашидова",
    city: "Ташкент",
    rating: 5,
    text: "SnapWed — это было лучшее решение для нашей свадьбы! Гости фотографировали со всех сторон, и у нас теперь 400+ живых фото. Обычный фотограф никогда бы не поймал столько моментов.",
    emoji: "👰",
  },
  {
    name: "Азиз Каримов",
    city: "Алматы",
    rating: 5,
    text: "Поставили QR на каждый стол — и к концу вечера уже 250 фото! Жена в восторге. Задания особенно понравились — гости соревновались кто сделает лучшее фото.",
    emoji: "🤵",
  },
  {
    name: "Диана Сейткали",
    city: "Бишкек",
    rating: 5,
    text: "Просто и удобно. Никаких приложений, гости просто сканируют QR с телефона. Даже бабушка справилась! Теперь советую всем кто готовится к свадьбе.",
    emoji: "👩",
  },
  {
    name: "Тимур Назаров",
    city: "Самарканд",
    rating: 5,
    text: "Брали план Starter и не пожалели. Живая галерея — это вообще огонь, гости видят фото друг друга в реальном времени и это создаёт такую атмосферу!",
    emoji: "👨",
  },
];

export default function Testimonials() {
  return (
    <section className="bg-dark-card py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Что говорят <span className="text-gold-400 italic">молодожёны</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-dark-bg/50 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <span key={j} className="text-gold-400 text-sm">★</span>
                ))}
              </div>
              <p className="text-gray-300 font-sans text-sm leading-relaxed mb-4 italic">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-400/10 flex items-center justify-center text-xl">
                  {t.emoji}
                </div>
                <div>
                  <p className="text-white font-sans font-medium text-sm">{t.name}</p>
                  <p className="text-gray-500 font-sans text-xs">{t.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
