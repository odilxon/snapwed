"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CameraCapture from "./CameraCapture";
import { createClient } from "@/lib/supabase/client";

interface Task {
  id: string;
  title: string;
  emoji: string;
}

interface TaskListProps {
  weddingId: string;
  weddingSlug: string;
  weddingTitle: string;
  tasks: Task[];
  maxPhotos: number;
}

export default function TaskList({ weddingId, weddingSlug, weddingTitle, tasks, maxPhotos }: TaskListProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [photosUploaded, setPhotosUploaded] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem(`snapwed-session-${weddingId}`);
    if (stored) {
      setSessionId(stored);
      loadProgress(stored);
    } else {
      createSession();
    }
  }, [weddingId]);

  async function createSession() {
    const supabase = createClient();
    const { data } = await supabase
      .from("guest_sessions")
      .insert({ wedding_id: weddingId })
      .select()
      .single();
    if (data) {
      localStorage.setItem(`snapwed-session-${weddingId}`, data.id);
      setSessionId(data.id);
    }
  }

  async function loadProgress(sid: string) {
    const supabase = createClient();
    const { data } = await supabase
      .from("photos")
      .select("task_id")
      .eq("guest_session_id", sid);
    if (data) {
      const done = data.map((p) => p.task_id).filter(Boolean) as string[];
      setCompletedTasks(done);
      setPhotosUploaded(data.length);
    }
  }

  function onPhotoTaken(taskId: string | null) {
    setActiveTask(null);
    if (taskId && !completedTasks.includes(taskId)) {
      setCompletedTasks((prev) => [...prev, taskId]);
    }
    setPhotosUploaded((prev) => prev + 1);
  }

  if (activeTask !== undefined && activeTask !== null) {
    return (
      <CameraCapture
        weddingId={weddingId}
        sessionId={sessionId!}
        taskId={activeTask.id}
        taskTitle={activeTask.title}
        taskEmoji={activeTask.emoji}
        onSuccess={() => onPhotoTaken(activeTask.id)}
        onCancel={() => setActiveTask(null)}
      />
    );
  }

  const progress = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;

  return (
    <div className="max-w-[430px] mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/w/${weddingSlug}`} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ArrowLeft size={22} />
        </Link>
        <div>
          <h1 className="font-display text-xl text-gray-900">Задания</h1>
          <p className="text-gray-400 text-sm font-sans">{weddingTitle}</p>
        </div>
      </div>

      {/* Progress */}
      {tasks.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between text-sm font-sans text-gray-500 mb-2">
            <span>Выполнено заданий</span>
            <span className="font-semibold text-gray-900">{completedTasks.length} из {tasks.length}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #D4A853, #C7816A)",
              }}
            />
          </div>
          <p className="text-xs text-gray-400 font-sans mt-1">
            {photosUploaded} фото загружено · Лимит {maxPhotos}
          </p>
        </div>
      )}

      {/* Tasks */}
      <div className="space-y-3 mb-6">
        {tasks.map((task) => {
          const done = completedTasks.includes(task.id);
          return (
            <button
              key={task.id}
              onClick={() => !done && sessionId && setActiveTask(task)}
              disabled={done || !sessionId || photosUploaded >= maxPhotos}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                done
                  ? "border-green-200 bg-green-50 opacity-80"
                  : photosUploaded >= maxPhotos
                  ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                  : "border-gray-200 bg-white hover:border-gold-400 hover:shadow-md active:scale-98"
              }`}
            >
              <span className="text-3xl flex-shrink-0">{task.emoji}</span>
              <div className="flex-1">
                <p className={`font-sans font-medium ${done ? "text-green-700" : "text-gray-800"}`}>
                  {task.title}
                </p>
                <p className={`text-xs font-sans mt-0.5 ${done ? "text-green-500" : "text-gray-400"}`}>
                  {done ? "✓ Выполнено!" : "Нажмите чтобы сфотографировать"}
                </p>
              </div>
              {!done && photosUploaded < maxPhotos && (
                <div className="w-8 h-8 rounded-full bg-[#D4875A] flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">📸</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Free photo */}
      {sessionId && photosUploaded < maxPhotos && (
        <button
          onClick={() => setActiveTask({ id: "free", title: "Свободное фото", emoji: "📷" })}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 font-sans hover:border-gold-400 hover:text-gold-400 transition-colors"
        >
          📷 Сделать своё фото
        </button>
      )}

      {photosUploaded >= maxPhotos && (
        <div className="bg-amber-50 rounded-2xl p-4 text-center text-amber-700 font-sans text-sm">
          Вы достигли лимита в {maxPhotos} фото. Спасибо!
        </div>
      )}
    </div>
  );
}
