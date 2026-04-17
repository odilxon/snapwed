"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { FiArrowRight, FiArrowLeft, FiPlus, FiX, FiCheck, FiZap, FiImage, FiUsers, FiHeart } from "react-icons/fi";

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

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");

  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [customTask, setCustomTask] = useState("");
  const [maxPhotos, setMaxPhotos] = useState(15);
  const [greetingText, setGreetingText] = useState(
    "Дорогие гости! Помогите нам сохранить воспоминания этого особенного дня."
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-display text-gray-900">Новая свадьба</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Шаг {step} из 2</p>
        <div className="flex gap-2 mt-3">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? "bg-amber-400" : "bg-gray-200"}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? "bg-amber-400" : "bg-gray-200"}`} />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <h2 className="font-display text-xl text-gray-900">Основная информация</h2>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Название свадьбы *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Например: "Свадьба Азиза и Малики"'
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Дата свадьбы *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-500 mb-2">Место проведения</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="Ташкент, ресторан Parvoz"
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>

          <button
            onClick={() => { if (title && date) setStep(2); }}
            disabled={!title || !date}
            className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-all"
          >
            Далее
            <FiArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-display text-xl text-gray-900 mb-1">Задания для гостей</h2>
            <p className="text-sm text-gray-400 mb-4">Выберите какие моменты должны сфотографировать гости</p>

            <div className="space-y-2 mb-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-amber-200 transition-colors"
                >
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                      task.enabled ? "bg-amber-400 border-amber-400" : "border-gray-300"
                    }`}
                  >
                    {task.enabled && <FiCheck className="w-3 h-3 text-white" />}
                  </button>
                  <span className="text-xl flex-shrink-0">{task.emoji}</span>
                  <span className="text-gray-700 flex-1">{task.title}</span>
                  {task.id.startsWith("custom-") && (
                    <button onClick={() => removeTask(task.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <FiX className="w-4 h-4" />
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
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
              <button
                onClick={addCustomTask}
                className="bg-amber-50 hover:bg-amber-100 text-amber-500 px-3 py-2.5 rounded-xl transition-colors"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
            <div>
              <label className="block text-sm text-gray-500 mb-3">
                Максимум фото от гостя: <strong className="text-gray-900">{maxPhotos}</strong>
              </label>
              <input
                type="range"
                min={5}
                max={30}
                value={maxPhotos}
                onChange={(e) => setMaxPhotos(Number(e.target.value))}
                className="w-full accent-amber-400"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>5</span>
                <span>30</span>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-500 mb-2">Текст приветствия</label>
              <textarea
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all text-sm resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-5 py-3.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              Назад
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-gray-900 font-semibold py-3.5 rounded-xl transition-colors"
            >
              {loading ? "Создаём..." : (
                <>
                  <FiZap className="w-5 h-5" />
                  Создать свадьбу
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
