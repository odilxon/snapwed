import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dark-bg border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-gold-400 text-xl mb-2">SnapWed</h3>
            <p className="text-gray-500 font-sans text-sm leading-relaxed">
              Превращаем каждого гостя в фотографа. Сотни живых моментов с вашей свадьбы.
            </p>
          </div>

          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-3">Продукт</h4>
            <ul className="space-y-2">
              {[
                { label: "Как работает", href: "#how-it-works" },
                { label: "Возможности", href: "#features" },
                { label: "Цены", href: "#pricing" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-gray-300 font-sans text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-3">Аккаунт</h4>
            <ul className="space-y-2">
              {[
                { label: "Войти", href: "/login" },
                { label: "Регистрация", href: "/register" },
                { label: "Дашборд", href: "/dashboard" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-gray-300 font-sans text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-sans font-semibold text-sm mb-3">Поддержка</h4>
            <ul className="space-y-2">
              {[
                { label: "Telegram", href: "https://t.me/snapwed" },
                { label: "Instagram", href: "https://instagram.com/snapwed" },
              ].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-gray-500 hover:text-gray-300 font-sans text-sm transition-colors">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 font-sans text-sm">
            © 2025 SnapWed. Все права защищены.
          </p>
          <p className="text-gray-700 font-sans text-xs">
            Made with 💍 for couples in love
          </p>
        </div>
      </div>
    </footer>
  );
}
