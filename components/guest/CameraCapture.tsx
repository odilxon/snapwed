"use client";

import { useRef, useState } from "react";
import { FiX, FiRotateCcw, FiCheck } from "react-icons/fi";
import { createClient } from "@/lib/supabase/client";
import { compressImage, createThumbnail } from "@/lib/utils";

interface CameraCaptureProps {
  weddingId: string;
  sessionId: string;
  taskId: string;
  taskTitle: string;
  taskEmoji: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CameraCapture({
  weddingId,
  sessionId,
  taskId,
  taskTitle,
  taskEmoji,
  onSuccess,
  onCancel,
}: CameraCaptureProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const [mode, setMode] = useState<"select" | "preview" | "uploading" | "done">("select");
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function handleCameraCapture(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCapturedBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMode("preview");
  }

  function handleGallerySelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCapturedBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMode("preview");
  }

  async function uploadPhoto() {
    if (!capturedBlob) return;
    
    setMode("uploading");
    setUploadProgress(10);

    try {
      const supabase = createClient();
      
      const file = new File([capturedBlob], "photo.jpg", { type: "image/jpeg" });
      
      const [compressed, thumb] = await Promise.all([
        compressImage(file, { maxWidth: 2048, quality: 0.85 }),
        createThumbnail(file),
      ]);
      
      const timestamp = Date.now();
      const path = `weddings/${weddingId}/${sessionId}/${timestamp}.jpg`;
      const thumbPath = `weddings/${weddingId}/${sessionId}/${timestamp}_thumb.jpg`;
      
      setUploadProgress(30);

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, compressed, { contentType: "image/jpeg" });

      if (uploadError) {
        throw new Error(uploadError.message);
      }
      
      setUploadProgress(50);

      await supabase.storage
        .from("photos")
        .upload(thumbPath, thumb, { contentType: "image/jpeg" });

      setUploadProgress(80);

      await supabase.from("photos").insert({
        wedding_id: weddingId,
        guest_session_id: sessionId,
        storage_path: path,
        thumbnail_path: thumbPath,
        task_id: taskId === "free" ? null : taskId,
      });

      setUploadProgress(100);
      setMode("done");
      
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки");
      setMode("preview");
    }
  }

  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setCapturedBlob(null);
    setPreviewUrl(null);
    setError(null);
    setMode("select");
  }

  if (mode === "select") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        <div className="flex items-center justify-between px-4 py-4 bg-black/80 absolute top-0 left-0 right-0 z-10">
          <button 
            onClick={onCancel} 
            className="text-white/70 active:text-white p-2"
          >
            <FiX className="w-7 h-7" />
          </button>
          <div className="text-center">
            <p className="text-white font-medium text-lg">
              {taskEmoji} {taskTitle}
            </p>
          </div>
          <div className="w-11" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          <div className="text-7xl">{taskEmoji}</div>
          <p className="text-white font-display text-2xl text-center">{taskTitle}</p>
          
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex items-center gap-3 bg-[#D4875A] active:bg-[#b86e48] text-white font-semibold px-10 py-5 rounded-2xl text-xl w-full max-w-xs"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Открыть камеру
          </button>
          
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleCameraCapture}
          />
          
          <div className="flex items-center gap-4 text-gray-500">
            <div className="h-px w-16 bg-gray-600" />
            <span className="text-sm">или</span>
            <div className="h-px w-16 bg-gray-600" />
          </div>
          
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex items-center gap-2 text-gray-400 active:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Выбрать из галереи
          </button>
          
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleGallerySelect}
          />
        </div>
      </div>
    );
  }

  if (mode === "preview" && previewUrl) {
    return (
      <div className="fixed inset-0 bg-black flex flex-col z-50">
        <div className="flex items-center justify-between px-4 py-4 bg-black/80 absolute top-0 left-0 right-0 z-10">
          <button 
            onClick={retake} 
            className="text-white/70 active:text-white p-2"
          >
            <FiX className="w-7 h-7" />
          </button>
          <div className="text-center">
            <p className="text-white font-medium">
              {taskEmoji} {taskTitle}
            </p>
          </div>
          <div className="w-11" />
        </div>

        <div className="flex-1 flex flex-col">
          <img src={previewUrl} alt="Превью" className="flex-1 object-contain" />
          
          {error && (
            <div className="bg-red-500/30 text-red-200 text-sm px-4 py-3 text-center">
              {error}
            </div>
          )}
          
          <div className="flex gap-4 px-6 py-8 bg-black">
            <button
              onClick={retake}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-white/30 active:border-white/50 text-white py-4 rounded-2xl font-medium active:bg-white/10 text-lg"
            >
              <FiRotateCcw className="w-6 h-6" />
              Переснять
            </button>
            <button
              onClick={uploadPhoto}
              className="flex-1 flex items-center justify-center gap-2 bg-[#D4875A] active:bg-[#b86e48] text-white font-semibold py-4 rounded-2xl text-lg"
            >
              <FiCheck className="w-6 h-6" />
              Отправить
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "uploading") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 px-8 z-50">
        <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
          <svg className="w-12 h-12 text-white animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-white font-display text-xl">Загружаем...</p>
        <div className="w-full max-w-xs bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-[#D4875A] rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">{uploadProgress}%</p>
      </div>
    );
  }

  if (mode === "done") {
    return (
      <div className="fixed inset-0 bg-black flex flex-col items-center justify-center gap-6 px-8 z-50">
        <div className="w-28 h-28 rounded-full bg-green-500/20 flex items-center justify-center">
          <FiCheck className="w-16 h-16 text-green-500" />
        </div>
        <p className="text-white font-display text-3xl">Отлично!</p>
        <p className="text-gray-400 text-center">Фото отправлено</p>
      </div>
    );
  }

  return null;
}
