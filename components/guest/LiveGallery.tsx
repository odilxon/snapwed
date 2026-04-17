"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { FiShare2 } from "react-icons/fi";

interface Photo {
  id: string;
  storage_path: string;
  thumbnail_path?: string | null;
}

interface LiveGalleryProps {
  weddingId: string;
  initialPhotos: Photo[];
}

export default function LiveGallery({ weddingId, initialPhotos }: LiveGalleryProps) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`wedding-photos-${weddingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "photos",
          filter: `wedding_id=eq.${weddingId}`,
        },
        (payload) => {
          const newPhoto = payload.new as Photo;
          setPhotos((prev) => [newPhoto, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [weddingId]);

  function getUrl(path: string) {
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({
        title: "Свадебные фото",
        text: "Посмотрите фото с нашей свадьбы!",
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  if (!photos.length) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">📸</div>
        <p className="text-gray-400 font-sans">Фото ещё нет</p>
        <p className="text-gray-300 font-sans text-sm mt-2">
          Будьте первым — сделайте фото!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleShare}
          className="flex items-center gap-2 text-sm font-sans text-gray-500 hover:text-gold-400 transition-colors"
        >
          <FiShare2 className="w-4 h-4" />
          Поделиться
        </button>
      </div>

      <div className="grid grid-cols-3 gap-1">
        {photos.map((photo, idx) => (
          <div
            key={photo.id}
            className={`relative aspect-square rounded-lg overflow-hidden bg-gray-100 ${
              idx === 0 ? "animate-fade-up" : ""
            }`}
          >
            <img
              src={getUrl(photo.thumbnail_path || photo.storage_path)}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
