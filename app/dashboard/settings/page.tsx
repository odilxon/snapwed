import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-gray-900">Настройки</h1>
        <p className="text-gray-500 font-sans mt-1">Ваш аккаунт и тарифный план</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
        <h2 className="font-display text-lg text-gray-900 mb-4">Профиль</h2>
        <div className="space-y-3">
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Имя</p>
            <p className="text-gray-900 font-sans">{profile?.full_name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Email</p>
            <p className="text-gray-900 font-sans">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-sans mb-1">Аккаунт создан</p>
            <p className="text-gray-900 font-sans">
              {new Date(user?.created_at || "").toLocaleDateString("ru-RU")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg text-gray-900 mb-4">Тарифный план</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { name: "Free", price: "$0", features: ["1 свадьба", "до 100 фото", "3 задания"], current: profile?.plan === "free" },
            { name: "Starter", price: "$19", features: ["до 100 гостей", "до 1000 фото", "15 заданий", "Живая галерея"], current: profile?.plan === "starter" },
            { name: "Premium", price: "$49", features: ["до 500 гостей", "до 5000 фото", "∞ заданий", "Живая галерея", "Слайдшоу", "Поддержка"], current: profile?.plan === "premium" },
          ].map((plan) => (
            <div key={plan.name} className={`rounded-xl p-4 border-2 ${plan.current ? "border-gold-400 bg-gold-50" : "border-gray-100"}`}>
              <h3 className="font-display text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-2xl font-display text-gold-400 mb-3">{plan.price}</p>
              <ul className="space-y-1">
                {plan.features.map((f) => (
                  <li key={f} className="text-xs text-gray-500 font-sans">✓ {f}</li>
                ))}
              </ul>
              {plan.current && (
                <span className="inline-block mt-3 text-xs bg-gold-400 text-dark-bg font-semibold px-2 py-1 rounded-full font-sans">
                  Текущий
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
