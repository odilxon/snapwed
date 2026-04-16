import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Heart, Camera, Users, Plus } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: weddings } = await supabase
    .from("weddings")
    .select("id, title, date, is_active")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const { count: photosCount } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .in("wedding_id", (weddings || []).map((w) => w.id));

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-gray-900">Дашборд</h1>
        <p className="text-gray-500 font-sans mt-1">Обзор ваших свадеб и фотографий</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
              <Heart size={20} className="text-gold-400" />
            </div>
            <span className="text-gray-500 font-sans text-sm">Свадьбы</span>
          </div>
          <p className="text-3xl font-display text-gray-900">{weddings?.length || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
              <Camera size={20} className="text-gold-400" />
            </div>
            <span className="text-gray-500 font-sans text-sm">Всего фото</span>
          </div>
          <p className="text-3xl font-display text-gray-900">{photosCount || 0}</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center">
              <Users size={20} className="text-gold-400" />
            </div>
            <span className="text-gray-500 font-sans text-sm">Активных свадеб</span>
          </div>
          <p className="text-3xl font-display text-gray-900">
            {weddings?.filter((w) => w.is_active).length || 0}
          </p>
        </div>
      </div>

      {/* Recent weddings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-display text-gray-900 text-lg">Последние свадьбы</h2>
          <Link
            href="/dashboard/weddings/new"
            className="flex items-center gap-2 bg-gold-400 hover:bg-gold-600 text-dark-bg font-semibold text-sm px-4 py-2 rounded-lg transition-colors font-sans"
          >
            <Plus size={16} />
            Создать
          </Link>
        </div>

        {!weddings?.length ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">💍</div>
            <p className="text-gray-400 font-sans mb-4">У вас ещё нет свадеб</p>
            <Link
              href="/dashboard/weddings/new"
              className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-600 text-dark-bg font-semibold px-6 py-3 rounded-lg transition-colors font-sans"
            >
              <Plus size={16} />
              Создать первую свадьбу
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {weddings.map((wedding) => (
              <Link
                key={wedding.id}
                href={`/dashboard/weddings/${wedding.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-lg">
                    💍
                  </div>
                  <div>
                    <p className="font-sans text-gray-900 font-medium">{wedding.title}</p>
                    <p className="text-xs text-gray-400 font-sans">
                      {new Date(wedding.date).toLocaleDateString("ru-RU", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-sans ${
                    wedding.is_active
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {wedding.is_active ? "Активна" : "Завершена"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
