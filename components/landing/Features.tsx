const features = [
  { emoji: "📱", title: "Без установки", desc: "Гости просто сканируют QR и сразу могут фотографировать. Никаких приложений, никаких регистраций." },
  { emoji: "🎯", title: "Задания для гостей", desc: "Первый танец, торт, слёзы радости — вы задаёте что снять, гости выполняют задания." },
  { emoji: "⚡", title: "Realtime галерея", desc: "Видите фото мгновенно — ещё во время свадьбы. Все гости фотографируют один момент с разных ракурсов." },
  { emoji: "🔍", title: "Умная фильтрация", desc: "Фото загружаются в хорошем качестве. Встроенное сжатие — быстро даже на слабом интернете." },
  { emoji: "📚", title: "Удобная галерея", desc: "Все фото в одном месте, сортировка по заданиям и времени. Скачивайте одним архивом." },
  { emoji: "🔒", title: "Ваши данные", desc: "Только вы и ваши гости видят фото. Безопасное хранение в облаке Supabase." },
];

export default function Features() {
  return (
    <section className="bg-dark-card py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Всё что нужно для <span className="text-gold-400 italic">идеальных</span> фото
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-dark-bg/60 border border-white/5 rounded-2xl p-6 hover:border-gold-400/30 transition-all hover:shadow-lg hover:shadow-gold-400/5"
            >
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-display text-white text-lg mb-2">{f.title}</h3>
              <p className="text-gray-400 font-sans text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
