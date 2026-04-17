"use client";

import { FiSmartphone, FiTarget, FiZap, FiImage, FiGrid, FiLock } from "react-icons/fi";

const features = [
  { 
    icon: FiSmartphone, 
    title: "Без установки", 
    desc: "Гости просто сканируют QR и сразу могут фотографировать. Никаких приложений, никаких регистраций." 
  },
  { 
    icon: FiTarget, 
    title: "Задания для гостей", 
    desc: "Первый танец, торт, слёзы радости — вы задаёте что снять, гости выполняют задания." 
  },
  { 
    icon: FiZap, 
    title: "Realtime галерея", 
    desc: "Видите фото мгновенно — ещё во время свадьбы. Все гости фотографируют один момент с разных ракурсов." 
  },
  { 
    icon: FiImage, 
    title: "Умная фильтрация", 
    desc: "Фото загружаются в хорошем качестве. Встроенное сжатие — быстро даже на слабом интернете." 
  },
  { 
    icon: FiGrid, 
    title: "Удобная галерея", 
    desc: "Все фото в одном месте, сортировка по заданиям и времени. Скачивайте одним архивом." 
  },
  { 
    icon: FiLock, 
    title: "Ваши данные", 
    desc: "Только вы и ваши гости видят фото. Безопасное хранение в облаке Supabase." 
  },
];

export default function Features() {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl text-gray-900 mb-4">
            Всё что нужно для <span className="text-amber-500 italic">идеальных</span> фото
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:shadow-lg hover:border-amber-200 transition-all hover:-translate-y-1"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-50 text-amber-600 mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-display text-lg text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
