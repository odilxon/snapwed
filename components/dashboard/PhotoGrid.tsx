"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { X, ZoomIn } from "lucide-react";

interface Photo {
  id: string;
  storage_path: string;
  created_at: string;
  task_id: string | null;
}

interface PhotoGridProps {
  photos: Photo[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const supabase = createClient();

  function getUrl(path: string) {
    const { data } = supabase.storage.from("photos").getPublicUrl(path);
    return data.publicUrl;
  }

  if (!photos.length) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📷</div>
        <p className="text-gray-400 font-sans">Фото пока нет</p>
        <p className="text-gray-300 font-sans text-sm mt-1">
          Поделитесь QR-кодом с гостями, чтобы они начали загружать фото
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(getUrl(photo.storage_path))}
            className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
          >
            <img
              src={getUrl(photo.storage_path)}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelected(null)}
          >
            <X size={28} />
          </button>
          <img
            src={selected}
            alt=""
            className="max-w-full max-h-full rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
