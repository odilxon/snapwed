"use client";

import { useEffect, useState } from "react";
import TaskList from "@/components/guest/TaskList";
import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";

export default function TasksPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const [weddingSlug, setWeddingSlug] = useState<string>("");
  const [wedding, setWedding] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setWeddingSlug(p.weddingSlug));
  }, [params]);

  useEffect(() => {
    if (!weddingSlug) return;

    const supabase = createClient();

    async function fetchWedding() {
      const { data } = await supabase
        .from("weddings")
        .select("id, title, tasks, max_photos_per_guest")
        .eq("slug", weddingSlug)
        .eq("is_active", true)
        .single();

      if (!data) {
        notFound();
        return;
      }

      setWedding(data);
      setLoading(false);
    }

    fetchWedding();
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
    <div className="min-h-screen bg-[#FFFBF8]">
      <TaskList
        weddingId={wedding.id}
        weddingSlug={weddingSlug}
        weddingTitle={wedding.title}
        tasks={wedding.tasks || []}
        maxPhotos={wedding.max_photos_per_guest}
      />
    </div>
  );
}
