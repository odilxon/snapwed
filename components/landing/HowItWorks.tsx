const steps = [
  { number: "01", emoji: "💍", title: "Создайте свадьбу", desc: "Зарегистрируйтесь, создайте свадьбу, задайте задания для гостей за 5 минут" },
  { number: "02", emoji: "📱", title: "Поделитесь QR-кодом", desc: "Распечатайте QR или отправьте ссылку в WhatsApp. Гости открывают — без установки приложений" },
  { number: "03", emoji: "🎉", title: "Получайте фото в реальном времени", desc: "Смотрите как растёт галерея прямо на свадьбе. Сотни живых моментов от разных гостей" },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-dark-bg py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Как это <span className="text-gold-400 italic">работает</span>
          </h2>
          <p className="text-gray-400 font-sans text-lg">Три шага до сотен свадебных фото</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-gold-400/30 to-transparent z-0 -translate-x-8" />
              )}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-400 text-dark-bg font-display text-xl font-bold mb-4 shadow-lg shadow-gold-400/20">
                  {step.number}
                </div>
                <div className="text-4xl mb-3">{step.emoji}</div>
                <h3 className="font-display text-xl text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 font-sans text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
