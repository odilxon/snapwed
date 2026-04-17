import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiHeart, FiCalendar, FiMapPin, FiUsers, FiCamera, FiCheckSquare, FiExternalLink, FiGrid, FiCheck } from "react-icons/fi";

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!wedding) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("wedding_id", id)
    .order("created_at", { ascending: false });

  const { data: sessions } = await supabase
    .from("guest_sessions")
    .select("id")
    .eq("wedding_id", id);

  const guestUrl = `${process.env.NEXT_PUBLIC_APP_URL}/w/${wedding.slug}`;
  const tasks = (wedding.tasks as Array<{ id: string; title: string; emoji: string }>) || [];
  const completedTasks = tasks.filter((t) =>
    photos?.some((p) => p.task_id === t.id)
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-display text-gray-900">{wedding.title}</h1>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 mt-1 text-gray-500 text-sm">
            <span className="flex items-center gap-1">
              <FiCalendar className="w-4 h-4" />
              {new Date(wedding.date).toLocaleDateString("ru-RU", {
                day: "numeric", month: "short", year: "numeric"
              })}
            </span>
            {wedding.venue && (
              <span className="flex items-center gap-1">
                <FiMapPin className="w-4 h-4" />
                {wedding.venue}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href={guestUrl}
            target="_blank"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 md:px-4 py-2 rounded-xl transition-colors"
          >
            <FiExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Страница гостя</span>
            <span className="sm:hidden">Гость</span>
          </Link>
          <Link
            href={`/dashboard/weddings/${id}/invite`}
            className="flex items-center gap-2 text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 px-3 md:px-4 py-2 rounded-xl transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM14 14h3v3h-3z" />
            </svg>
            QR
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-50 flex items-center justify-center">
              <FiUsers className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">Гостей</span>
          </div>
          <p className="text-xl md:text-2xl font-display text-gray-900">{sessions?.length || 0}</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FiCamera className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">Фото</span>
          </div>
          <p className="text-xl md:text-2xl font-display text-gray-900">{photos?.length || 0}</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-green-50 flex items-center justify-center">
              <FiCheckSquare className="w-4 h-4 text-green-500" />
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">Заданий</span>
          </div>
          <p className="text-xl md:text-2xl font-display text-gray-900">{completedTasks.length}/{tasks.length}</p>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${wedding.is_active ? "bg-green-50" : "bg-gray-100"}`}>
              <FiHeart className={`w-4 h-4 ${wedding.is_active ? "text-green-500" : "text-gray-400"}`} />
            </div>
            <span className="text-xs text-gray-400 hidden sm:inline">Статус</span>
          </div>
          <p className={`text-base md:text-lg font-display ${wedding.is_active ? "text-green-600" : "text-gray-500"}`}>
            {wedding.is_active ? "Активна" : "Завершена"}
          </p>
        </div>
      </div>

      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
          <h2 className="font-display text-base md:text-lg text-gray-900 mb-3 md:mb-4">Задания</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            {tasks.map((task) => {
              const done = photos?.some((p) => p.task_id === task.id);
              return (
                <div
                  key={task.id}
                  className={`p-2 md:p-3 rounded-xl text-sm flex items-center gap-2 ${
                    done ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {done && <FiCheck className="w-4 h-4 flex-shrink-0" />}
                  <span>{task.emoji}</span>
                  <span className="truncate">{task.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base md:text-lg text-gray-900">
            Фотографии {photos?.length ? `(${photos.length})` : ""}
          </h2>
          <Link
            href={`/dashboard/weddings/${id}/gallery`}
            className="flex items-center gap-2 text-sm font-medium text-amber-600 hover:text-amber-700"
          >
            <FiGrid className="w-4 h-4" />
            Галерея
          </Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-3">
          {(photos || []).slice(0, 12).map((photo) => (
            <div key={photo.id} className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`}
                alt="Фото"
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {(photos || []).length === 0 && (
            <div className="col-span-full text-center py-8 md:py-12 text-gray-400">
              Пока нет фотографий
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
