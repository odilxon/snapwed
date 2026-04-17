"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiCamera, FiImage, FiHeart, FiCalendar, FiMapPin } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

export default function GuestWeddingPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const [weddingSlug, setWeddingSlug] = useState<string>("");
  const [wedding, setWedding] = useState<any>(null);
  const [photosCount, setPhotosCount] = useState(0);
  const [guestsCount, setGuestsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setWeddingSlug(p.weddingSlug));
  }, [params]);

  useEffect(() => {
    if (!weddingSlug) return;

    const supabase = createClient();

    async function fetchData() {
      const { data: weddingData } = await supabase
        .from("weddings")
        .select("*")
        .eq("slug", weddingSlug)
        .eq("is_active", true)
        .single();

      if (!weddingData) {
        notFound();
        return;
      }

      setWedding(weddingData);

      const [{ count: photos }, { count: guests }] = await Promise.all([
        supabase
          .from("photos")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", weddingData.id),
        supabase
          .from("guest_sessions")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", weddingData.id),
      ]);

      setPhotosCount(photos || 0);
      setGuestsCount(guests || 0);
      setLoading(false);
    }

    fetchData();
  }, [weddingSlug]);

  if (loading || !wedding) {
    return (
      <div className="min-h-screen bg-[#FFFBF8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFBF8] flex items-center justify-center px-4">
      <div className="w-full max-w-[430px]">
        <div className="h-56 bg-gradient-to-br from-amber-400/30 via-rose-200/20 to-amber-400/10 rounded-3xl flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="relative z-10 bg-white/80 backdrop-blur-sm rounded-full p-6 shadow-sm">
            <FiHeart className="w-16 h-16 text-amber-500" />
          </div>
        </div>

        <div className="text-center mb-8 px-2">
          <h1 className="font-display text-3xl text-gray-900 mb-2">{wedding.title}</h1>
          <p className="text-gray-500 mb-1 flex items-center justify-center gap-1.5">
            <FiCalendar className="w-4 h-4" />
            {new Date(wedding.date).toLocaleDateString("ru-RU", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {wedding.venue && (
            <p className="text-gray-500 mb-4 flex items-center justify-center gap-1.5">
              <FiMapPin className="w-4 h-4" />
              {wedding.venue}
            </p>
          )}
          {wedding.greeting_text && (
            <p className="text-gray-600 text-sm leading-relaxed italic bg-white/60 rounded-2xl px-5 py-4">
              &ldquo;{wedding.greeting_text}&rdquo;
            </p>
          )}
        </div>

        {(photosCount > 0) && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-4 mb-6 text-center border border-white">
            <p className="text-gray-500 text-sm flex items-center justify-center gap-1.5">
              <FiCamera className="w-4 h-4" />
              <strong className="text-gray-900">{photosCount}</strong> фото от{" "}
              <strong className="text-gray-900">{guestsCount}</strong> гостей
            </p>
          </div>
        )}

        <div className="space-y-3 px-2">
          <Link
            href={`/w/${weddingSlug}/tasks`}
            className="flex items-center justify-center gap-3 w-full bg-[#2D1B1B] hover:bg-[#3d2424] text-white font-semibold py-4 rounded-2xl transition-colors text-lg"
          >
            <FiCamera size={22} />
            Начать съёмку
          </Link>

          <Link
            href={`/w/${weddingSlug}/upload`}
            className="flex items-center justify-center gap-3 w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-2xl transition-colors border border-gray-200"
          >
            <FiImage size={20} />
            Смотреть галерею
          </Link>
        </div>

        <p className="text-center text-xs text-gray-300 mt-8">
          Powered by SnapWed
        </p>
      </div>
    </div>
  );
}
