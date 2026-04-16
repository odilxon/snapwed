"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Plus, X } from "lucide-react";

const DEFAULT_TASKS = [
  { id: "first-dance", title: "Первый танец", emoji: "💃", enabled: true },
  { id: "tears", title: "Момент со слезами", emoji: "😢", enabled: true },
  { id: "cake", title: "Фото с тортом", emoji: "🎂", enabled: true },
  { id: "dancefloor", title: "Гости на танцполе", emoji: "🕺", enabled: true },
  { id: "couple", title: "Молодожёны крупным планом", emoji: "💑", enabled: true },
  { id: "decor", title: "Декор и детали", emoji: "🌸", enabled: true },
  { id: "backstage", title: "За кулисами подготовки", emoji: "🎭", enabled: false },
  { id: "funny", title: "Смешной момент", emoji: "😂", enabled: false },
];

export default function NewWeddingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");

  // Step 2
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [customTask, setCustomTask] = useState("");
  const [maxPhotos, setMaxPhotos] = useState(15);
  const [greetingText, setGreetingText] = useState(
    "Дорогие гости! Помогите нам сохранить воспоминания этого особенного дня. Фотографируйте искренние моменты и отправляйте нам!"
  );

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  }

  function addCustomTask() {
    if (!customTask.trim()) return;
    setTasks((prev) => [
      ...prev,
      { id: `custom-${Date.now()}`, title: customTask.trim(), emoji: "📸", enabled: true },
    ]);
    setCustomTask("");
  }

  function removeTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const slug = generateSlug(title);
    const enabledTasks = tasks.filter((t) => t.enabled);

    const { data, error } = await supabase.from("weddings").insert({
      owner_id: user.id,
      title,
      slug,
      date,
      venue: venue || null,
      greeting_text: greetingText,
      tasks: enabledTasks,
      max_photos_per_guest: maxPhotos,
    }).select().single();

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push(`/dashboard/weddings/${data.id}/invite`);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-gray-900">Новая свадьба</h1>
        <p className="text-gray-500 font-sans mt-1">Шаг {step} из 2</p>
        <div className="flex gap-2 mt-3">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-gold-400" : "bg-gray-200"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-gold-400" : "bg-gray-200"}`} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm mb-6 font-sans">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-xl text-gray-900">Основная информация</h2>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-sans">Название свадьбы *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Например: "Свадьба Азиза и Малики"'
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gold-400 transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-sans">Дата свадьбы *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gold-400 transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2 font-sans">Место проведения</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Ташкент, ресторан Parvoz"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gold-400 transition-colors font-sans"
            />
          </div>

          <button
            onClick={() => { if (title && date) setStep(2); }}
            disabled={!title || !date}
            className="w-full flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-600 disabled:opacity-40 text-dark-bg font-semibold py-3 rounded-lg transition-colors font-sans"
          >
            Далее
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-xl text-gray-900 mb-4">Задания для гостей</h2>
            <p className="text-sm text-gray-400 font-sans mb-4">Выберите какие моменты должны сфотографировать гости</p>

            <div className="space-y-2 mb-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gold-400/30 transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      task.enabled ? "bg-gold-400 border-gold-400" : "border-gray-300"
                    }`}
                  >
                    {task.enabled && <span className="text-white text-xs">✓</span>}
                  </button>
                  <span className="text-xl flex-shrink-0">{task.emoji}</span>
                  <span className="text-gray-700 font-sans flex-1">{task.title}</span>
                  {task.id.startsWith("custom-") && (
                    <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customTask}
                onChange={(e) => setCustomTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCustomTask()}
                placeholder="Добавить своё задание..."
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-gold-400 transition-colors font-sans"
              />
              <button
                onClick={addCustomTask}
                className="bg-gold-50 hover:bg-gold-100 text-gold-400 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm text-gray-500 mb-3 font-sans">
                Максимум фото от одного гостя: <strong className="text-gray-900">{maxPhotos}</strong>
              </label>
              <input
                type="range"
                min={5}
                max={30}
                value={maxPhotos}
                onChange={(e) => setMaxPhotos(Number(e.target.value))}
                className="w-full accent-gold-400"
              />
              <div className="flex justify-between text-xs text-gray-400 font-sans mt-1">
                <span>5</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2 font-sans">Текст приветствия для гостей</label>
              <textarea
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-gold-400 transition-colors font-sans text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors font-sans"
            >
              <ChevronLeft size={18} />
              Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-600 disabled:opacity-50 text-dark-bg font-semibold py-3 rounded-lg transition-colors font-sans"
            >
              {loading ? "Создаём..." : "Создать свадьбу 🎊"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
