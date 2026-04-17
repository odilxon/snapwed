"use client";

import { FiHeart, FiSmartphone, FiZap } from "react-icons/fi";
import { BsQrCodeScan } from "react-icons/bs";

const steps = [
  { 
    number: "01", 
    icon: FiHeart, 
    title: "Создайте свадьбу", 
    desc: "Зарегистрируйтесь, создайте свадьбу, задайте задания для гостей за 5 минут" 
  },
  { 
    number: "02", 
    icon: BsQrCodeScan, 
    title: "Поделитесь QR-кодом", 
    desc: "Распечатайте QR или отправьте ссылку в WhatsApp. Гости открывают — без установки приложений" 
  },
  { 
    number: "03", 
    icon: FiZap, 
    title: "Получайте фото в реальном времени", 
    desc: "Смотрите как растёт галерея прямо на свадьбе. Сотни живых моментов от разных гостей" 
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Как это <span className="text-amber-500 italic">работает</span>
          </h2>
          <p className="text-gray-500 text-lg">Три шага до сотен свадебных фото</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-200 z-0" />
              )}
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-gray-200 shadow-sm mb-6">
                  <span className="font-display text-xl font-bold text-gray-400">{step.number}</span>
                </div>
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mb-4">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="font-display text-xl text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
