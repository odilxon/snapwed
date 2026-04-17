import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FiHeart, FiPlus, FiImage, FiCalendar, FiMapPin } from "react-icons/fi";
import { FiExternalLink } from "react-icons/fi";

export default async function WeddingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: weddings } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-display text-gray-900">Мои свадьбы</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Управляйте своими свадебными событиями</p>
        </div>
        <Link
          href="/dashboard/weddings/new"
          className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          Новая свадьба
        </Link>
      </div>

      {!weddings?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-50 flex items-center justify-center">
            <FiHeart className="w-10 h-10 text-amber-400" />
          </div>
          <h2 className="text-xl font-display text-gray-900 mb-2">Создайте первую свадьбу</h2>
          <p className="text-gray-400 mb-6 max-w-sm mx-auto">
            Создайте свадьбу, получите QR-код и гости начнут отправлять фото
          </p>
          <Link
            href="/dashboard/weddings/new"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Создать свадьбу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {weddings.map((wedding) => (
            <div key={wedding.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all group">
              <div className="h-32 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-50 flex items-center justify-center relative">
                <div className="absolute top-3 right-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    wedding.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {wedding.is_active ? "Активна" : "Завершена"}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur flex items-center justify-center shadow-sm">
                  <FiHeart className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">{wedding.title}</h3>
                <div className="space-y-1.5 text-sm text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="w-4 h-4" />
                    {new Date(wedding.date).toLocaleDateString("ru-RU", {
                      day: "numeric", month: "long", year: "numeric"
                    })}
                  </div>
                  {wedding.venue && (
                    <div className="flex items-center gap-2">
                      <FiMapPin className="w-4 h-4" />
                      {wedding.venue}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-3 border-t border-gray-50">
                  <Link
                    href={`/dashboard/weddings/${wedding.id}/gallery`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 rounded-xl transition-colors"
                  >
                    <FiImage className="w-4 h-4" />
                    Галерея
                  </Link>
                  <Link
                    href={`/dashboard/weddings/${wedding.id}/invite`}
                    className="flex-1 flex items-center justify-center gap-1.5 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 px-3 py-2.5 rounded-xl transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" />
                    </svg>
                    QR-код
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
