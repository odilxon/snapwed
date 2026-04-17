import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FiHeart, FiCamera, FiUsers, FiPlus, FiArrowRight, FiCalendar, FiMapPin } from "react-icons/fi";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: weddings } = await supabase
    .from("weddings")
    .select("id, title, slug, date, venue, is_active")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const weddingIds = (weddings || []).map((w) => w.id);
  
  let photosCount = 0;
  if (weddingIds.length > 0) {
    const { count } = await supabase
      .from("photos")
      .select("id", { count: "exact", head: true })
      .in("wedding_id", weddingIds);
    photosCount = count || 0;
  }

  return (
    <div className="max-w-5xl">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-display text-gray-900 mb-1">Добро пожаловать!</h1>
        <p className="text-gray-500 text-sm md:text-base">Управляйте свадьбами и просматривайте фотографии</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <FiHeart className="w-7 h-7 text-amber-500" />
            </div>
            <div>
              <p className="text-3xl font-display text-gray-900">{weddings?.length || 0}</p>
              <p className="text-sm text-gray-400">Свадеб</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <FiCamera className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-display text-gray-900">{photosCount}</p>
              <p className="text-sm text-gray-400">Всего фото</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center">
              <FiUsers className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-display text-gray-900">
                {weddings?.filter((w) => w.is_active).length || 0}
              </p>
              <p className="text-sm text-gray-400">Активных</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent weddings */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h2 className="font-display text-lg text-gray-900">Последние свадьбы</h2>
          <Link
            href="/dashboard/weddings/new"
            className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Создать
          </Link>
        </div>

        {!weddings?.length ? (
          <div className="text-center py-16 px-6">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
              <FiHeart className="w-10 h-10 text-amber-400" />
            </div>
            <h3 className="text-xl font-display text-gray-900 mb-2">Начните с первой свадьбы</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Создайте свадьбу, сгенерируйте QR-код и поделитесь с гостями
            </p>
            <Link
              href="/dashboard/weddings/new"
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              <FiPlus className="w-5 h-5" />
              Создать первую свадьбу
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {weddings.map((wedding) => (
              <Link
                key={wedding.id}
                href={`/dashboard/weddings/${wedding.id}`}
                className="flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
                    <FiHeart className="w-6 h-6 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">{wedding.title}</p>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {new Date(wedding.date).toLocaleDateString("ru-RU", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      {wedding.venue && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="w-3 h-3" />
                          {wedding.venue}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                      wedding.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {wedding.is_active ? "Активна" : "Завершена"}
                  </span>
                  <FiArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
