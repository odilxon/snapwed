import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen bg-dark-bg relative overflow-hidden flex items-center">
      {/* Gold grain overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, #D4A853 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, #C7816A 0%, transparent 50%)`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div>
          <div className="inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/20 rounded-full px-4 py-1.5 mb-6">
            <span className="text-gold-400 text-sm font-sans">💍 Свадебные фото нового поколения</span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            Каждый гость —<br />
            <span className="text-gold-400 italic">ваш фотограф</span>
          </h1>

          <p className="text-gray-400 font-sans text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            QR-код → гости фотографируют → вы получаете сотни живых моментов прямо на свадьбе. Без приложений. Без хлопот.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-600 text-dark-bg font-semibold px-8 py-4 rounded-xl transition-colors font-sans text-lg"
            >
              Начать бесплатно
              <span>→</span>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex items-center justify-center gap-2 border border-white/20 text-white hover:bg-white/5 font-semibold px-8 py-4 rounded-xl transition-colors font-sans text-lg"
            >
              Смотреть демо
            </Link>
          </div>

          <p className="text-gray-600 font-sans text-sm mt-4">
            Бесплатно для первой свадьбы · Без кредитной карты
          </p>
        </div>

        {/* Phone mockup */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <div
              className="absolute inset-0 blur-3xl opacity-30"
              style={{ background: "radial-gradient(circle, #D4A853, transparent 70%)" }}
            />
            <div className="relative w-64 md:w-72 bg-[#FFFBF8] rounded-[3rem] border-4 border-gray-700 shadow-2xl overflow-hidden animate-[float_3s_ease-in-out_infinite]"
              style={{
                animation: "float 3s ease-in-out infinite",
              }}
            >
              <style>{`@keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }`}</style>
              <div className="h-40 bg-gradient-to-br from-gold-400/30 to-rose-warm/30 flex items-center justify-center">
                <span className="text-6xl">💍</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-gray-900 text-lg mb-1">Свадьба Азиза и Малики</h3>
                <p className="text-gray-400 font-sans text-xs mb-4">14 сентября 2025 · Ташкент</p>
                <div className="bg-[#2D1B1B] text-white text-center py-3 rounded-xl font-sans text-sm font-semibold">
                  📸 Начать съёмку
                </div>
                <div className="mt-3 text-center text-xs text-gray-400 font-sans">
                  312 фото от 47 гостей
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
