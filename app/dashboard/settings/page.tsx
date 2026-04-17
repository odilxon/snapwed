import { createClient } from "@/lib/supabase/server";
import { FiSettings, FiMail, FiCalendar, FiCheck } from "react-icons/fi";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-display text-gray-900">Настройки</h1>
        <p className="text-gray-500 mt-1 text-sm md:text-base">Ваш аккаунт и тарифный план</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-5">
        <h2 className="font-display text-base md:text-lg text-gray-900 mb-4">Профиль</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          <div className="p-3 md:p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Имя</p>
            <p className="text-gray-900 font-medium flex items-center gap-2 text-sm md:text-base">
              <FiSettings className="w-4 h-4 text-gray-400" />
              {profile?.full_name || "—"}
            </p>
          </div>
          <div className="p-3 md:p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Email</p>
            <p className="text-gray-900 font-medium flex items-center gap-2 text-sm md:text-base truncate">
              <FiMail className="w-4 h-4 text-gray-400 flex-shrink-0" />
              {user?.email}
            </p>
          </div>
          <div className="p-3 md:p-4 bg-gray-50 rounded-xl">
            <p className="text-xs text-gray-400 mb-1">Аккаунт создан</p>
            <p className="text-gray-900 font-medium flex items-center gap-2 text-sm md:text-base">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              {new Date(user?.created_at || "").toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg text-gray-900 mb-4">Тарифный план</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { name: "Free", price: "$0", features: ["1 свадьба", "до 100 фото", "3 задания"], current: profile?.plan === "free" },
            { name: "Starter", price: "$19", features: ["до 100 гостей", "до 1000 фото", "15 заданий", "Живая галерея"], current: profile?.plan === "starter" },
            { name: "Premium", price: "$49", features: ["до 500 гостей", "до 5000 фото", "∞ заданий", "Живая галерея", "Слайдшоу"], current: profile?.plan === "premium" },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl p-5 border-2 transition-all ${plan.current ? "border-amber-400 bg-amber-50" : "border-gray-100 hover:border-gray-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-gray-900">{plan.name}</h3>
                {plan.current && (
                  <span className="text-xs bg-amber-400 text-gray-900 font-medium px-2 py-0.5 rounded-full">
                    Текущий
                  </span>
                )}
              </div>
              <p className="text-2xl font-display text-amber-500 mb-3">{plan.price}</p>
              <ul className="space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FiCheck className="w-3 h-3 text-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
