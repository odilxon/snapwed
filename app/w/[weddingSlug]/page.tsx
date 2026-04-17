import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiCamera, FiImage, FiHeart, FiCalendar, FiMapPin } from "react-icons/fi";

export default async function GuestWeddingPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = await params;
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("slug", weddingSlug)
    .eq("is_active", true)
    .single();

  if (!wedding) notFound();

  const { count: photosCount } = await supabase
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", wedding.id);

  const { count: guestsCount } = await supabase
    .from("guest_sessions")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", wedding.id);

  return (
    <div className="min-h-screen bg-[#FFFBF8] flex items-center justify-center px-4">
      <div className="w-full max-w-[430px]">
        {/* Cover */}
        <div className="h-56 bg-gradient-to-br from-amber-400/30 via-rose-200/20 to-amber-400/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-sm">
            <FiHeart className="w-16 h-16 text-amber-500" />
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-8 px-2">
          <h1 className="font-display text-3xl text-gray-900 mb-2">{wedding.title}</h1>
          <p className="text-gray-500 font-sans mb-1 flex items-center justify-center gap-1.5">
            <FiCalendar className="w-4 h-4" />
            {new Date(wedding.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {wedding.venue && (
            <p className="text-gray-500 font-sans mb-4 flex items-center justify-center gap-1.5">
              <FiMapPin className="w-4 h-4" />
              {wedding.venue}
            </p>
          )}
          {wedding.greeting_text && (
            <p className="text-gray-600 font-sans text-sm leading-relaxed italic bg-white/60 rounded-2xl px-5 py-4">
              &ldquo;{wedding.greeting_text}&rdquo;
            </p>
          )}
        </div>

        {/* Stats */}
        {(photosCount || 0) > 0 && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 mb-6 text-center border border-white">
            <p className="text-gray-500 font-sans text-sm flex items-center justify-center gap-1.5">
              <FiCamera className="w-4 h-4" />
              <strong className="text-gray-900">{photosCount}</strong> фото от{" "}
              <strong className="text-gray-900">{guestsCount}</strong> гостей
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3 px-2">
          <Link
            href={`/w/${weddingSlug}/tasks`}
            className="flex items-center justify-center gap-3 w-full bg-[#2D1B1B] hover:bg-[#3d2424] text-white font-semibold py-4 rounded-2xl transition-colors font-sans text-lg"
          >
            <FiCamera size={22} />
            Начать съёмку
          </Link>

          <Link
            href={`/w/${weddingSlug}/upload`}
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-2xl transition-colors font-sans border border-gray-200"
          >
            <FiImage size={20} />
            Смотреть галерею
          </Link>
        </div>

        <p className="text-center text-xs text-gray-300 font-sans mt-8">
          Powered by SnapWed
        </p>
      </div>
    </div>
  );
}
