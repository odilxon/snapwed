"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import LiveGallery from "@/components/guest/LiveGallery";
import { FiArrowLeft } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

export default function GalleryPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const [weddingSlug, setWeddingSlug] = useState<string>("");
  const [wedding, setWedding] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
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
        .select("id, title")
        .eq("slug", weddingSlug)
        .eq("is_active", true)
        .single();

      if (!weddingData) {
        notFound();
        return;
      }

      setWedding(weddingData);

      const [photosData, guestsData] = await Promise.all([
        supabase
          .from("photos")
          .select("id, storage_path, thumbnail_path, created_at")
          .eq("wedding_id", weddingData.id)
          .eq("is_approved", true)
          .order("created_at", { ascending: false }),
        supabase
          .from("guest_sessions")
          .select("id", { count: "exact", head: true })
          .eq("wedding_id", weddingData.id),
      ]);

      setPhotos(photosData.data || []);
      setGuestsCount(guestsData.count || 0);
      setLoading(false);
    }

    fetchData();
  }, [weddingSlug]);

  if (loading) {
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
    <div className="min-h-screen bg-[#FFFBF8]">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/w/${weddingSlug}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <FiArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="font-display text-xl text-gray-900">Галерея</h1>
            <p className="text-gray-400 text-sm">
              {photos.length} фото от {guestsCount} гостей
            </p>
          </div>
        </div>

        <LiveGallery
          weddingId={wedding.id}
          initialPhotos={photos.map((p) => ({ id: p.id, storage_path: p.storage_path, thumbnail_path: p.thumbnail_path }))}
        />
      </div>
    </div>
  );
}
