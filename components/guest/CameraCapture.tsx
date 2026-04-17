"use client";

import { useRef, useState, useCallback } from "react";
import { X, RotateCcw, Check, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/utils";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [mode, setMode] = useState<"camera" | "preview" | "uploading" | "done">("camera");
  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch {
      // fallback to file input
      fileInputRef.current?.click();
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  }, []);

  function capturePhoto() {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      stopCamera();
      setCapturedBlob(blob);
      setPreviewUrl(URL.createObjectURL(blob));
      setMode("preview");
    }, "image/jpeg", 0.9);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCapturedBlob(file);
    setPreviewUrl(URL.createObjectURL(file));
    setMode("preview");
  }

  async function uploadPhoto() {
    if (!capturedBlob) return;
    setMode("uploading");
    setUploadProgress(20);

    const supabase = createClient();
    const compressed = await compressImage(
      new File([capturedBlob], "photo.jpg", { type: "image/jpeg" }),
      { maxWidth: 2048, quality: 0.85 }
    );
    setUploadProgress(50);

    const path = `weddings/${weddingId}/${sessionId}/${Date.now()}.jpg`;
    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(path, compressed, { contentType: "image/jpeg" });

    if (uploadError) {
      setError(uploadError.message);
      setMode("preview");
      return;
    }
    setUploadProgress(80);

    await supabase.from("photos").insert({
      wedding_id: weddingId,
      guest_session_id: sessionId,
      storage_path: path,
      task_id: taskId === "free" ? null : taskId,
    });

    const { data: session } = await supabase
      .from("guest_sessions")
      .select("photos_count")
      .eq("id", sessionId)
      .single();
    
    await supabase
      .from("guest_sessions")
      .update({ photos_count: (session?.photos_count || 0) + 1 })
      .eq("id", sessionId);

    setUploadProgress(100);
    setMode("done");
    setTimeout(onSuccess, 1000);
  }

  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setCapturedBlob(null);
    setMode("camera");
    setCameraActive(false);
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 bg-black/50 absolute top-0 left-0 right-0 z-10">
        <button onClick={() => { stopCamera(); onCancel(); }} className="text-white/70 hover:text-white transition-colors">
          <X size={24} />
        </button>
        <div className="text-center">
          <p className="text-white font-sans text-sm font-semibold">
            {taskEmoji} {taskTitle}
          </p>
        </div>
        <div className="w-6" />
      </div>

      {/* Camera / Preview */}
      {mode === "camera" && (
        <>
          {!cameraActive ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
              <div className="text-6xl">{taskEmoji}</div>
              <p className="text-white font-display text-2xl text-center">{taskTitle}</p>
              <button
                onClick={startCamera}
                className="flex items-center gap-3 bg-[#D4875A] hover:bg-[#b86e48] text-white font-semibold px-8 py-4 rounded-2xl transition-colors font-sans text-lg"
              >
                <Camera size={22} />
                Открыть камеру
              </button>
              <p className="text-gray-500 font-sans text-sm text-center">или</p>
              <label className="text-gray-400 font-sans text-sm cursor-pointer hover:text-white transition-colors underline">
                Выбрать из галереи
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div className="relative flex-1">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <canvas ref={canvasRef} className="hidden" />
              <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                >
                  <div className="w-12 h-12 rounded-full bg-white" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {mode === "preview" && previewUrl && (
        <div className="flex-1 flex flex-col">
          <img src={previewUrl} alt="Превью" className="flex-1 object-contain" />
          {error && (
            <div className="bg-red-500/20 text-red-300 text-sm font-sans px-4 py-2 text-center">
              {error}
            </div>
          )}
          <div className="flex gap-4 px-6 py-6 bg-black">
            <button
              onClick={retake}
              className="flex-1 flex items-center justify-center gap-2 border border-white/20 text-white py-3 rounded-xl font-sans hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={18} />
              Переснять
            </button>
            <button
              onClick={uploadPhoto}
              className="flex-1 flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#b8903f] text-black font-semibold py-3 rounded-xl font-sans transition-colors"
            >
              <Check size={18} />
              Отправить
            </button>
          </div>
        </div>
      )}

      {mode === "uploading" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="text-4xl">📤</div>
          <p className="text-white font-display text-xl">Загружаем фото...</p>
          <div className="w-full max-w-xs bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gold-400 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-gray-400 font-sans text-sm">{uploadProgress}%</p>
        </div>
      )}

      {mode === "done" && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-8">
          <div className="text-6xl">🎉</div>
          <p className="text-white font-display text-2xl">Отлично!</p>
          <p className="text-gray-300 font-sans text-center">Фото сохранено. Молодожёны увидят его!</p>
        </div>
      )}
    </div>
  );
}
