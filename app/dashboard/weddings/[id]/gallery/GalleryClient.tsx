"use client";

import { useState } from "react";
import { FiDownload, FiFilter, FiGrid, FiImage, FiClock, FiLoader } from "react-icons/fi";
import { downloadGalleryAsZip } from "@/lib/utils";

interface Photo {
  id: string;
  storage_path: string;
  task_id: string | null;
  created_at: string;
}

interface Task {
  id: string;
  title: string;
  emoji: string;
}

interface GalleryClientProps {
  photos: Photo[];
  tasks: Task[];
  weddingTitle: string;
}

export default function GalleryClient({ photos, tasks, weddingTitle }: GalleryClientProps) {
  const [filter, setFilter] = useState<string>("all");
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const filteredPhotos = filter === "all" 
    ? photos 
    : photos.filter((p) => p.task_id === filter);

  async function handleDownload() {
    if (photos.length === 0) return;
    
    setDownloading(true);
    setDownloadProgress(0);
    
    await downloadGalleryAsZip(
      photos,
      weddingTitle,
      (progress) => setDownloadProgress(progress)
    );
    
    setDownloading(false);
    setDownloadProgress(0);
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display text-gray-900">Галерея</h1>
          <p className="text-gray-500 font-sans mt-1">{weddingTitle}</p>
        </div>
        <button
          onClick={handleDownload}
          disabled={downloading || photos.length === 0}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-xl font-medium transition-colors"
        >
          {downloading ? (
            <>
              <FiLoader className="w-4 h-4 animate-spin" />
              {downloadProgress}%
            </>
          ) : (
            <>
              <FiDownload className="w-4 h-4" />
              Скачать все ({photos.length})
            </>
          )}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
          <button
            onClick={() => setFilter("all")}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <FiGrid className="w-4 h-4" />
            Все
          </button>
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => setFilter(task.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === task.id ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {task.emoji}
              {task.title}
            </button>
          ))}
        </div>
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="bg-gray-50 border border-gray-100 rounded-2xl p-12 text-center">
          <FiImage className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Пока нет фотографий</p>
          <p className="text-gray-400 text-sm mt-1">Фото появятся когда гости начнут загружать</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => {
            const task = tasks.find((t) => t.id === photo.task_id);
            const taskTitle = task ? `${task.emoji} ${task.title}` : "Свободное фото";
            
            return (
              <div
                key={photo.id}
                className="relative group aspect-square bg-gray-100 rounded-xl overflow-hidden"
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/photos/${photo.storage_path}`}
                  alt="Фото"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium truncate">{taskTitle}</p>
                  <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
                    <FiClock className="w-3 h-3" />
                    {new Date(photo.created_at).toLocaleString("ru-RU", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-gray-400 text-sm mt-6">
        Показано {filteredPhotos.length} из {photos.length} фото
      </p>
    </div>
  );
}
