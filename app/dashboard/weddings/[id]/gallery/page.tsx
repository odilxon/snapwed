import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import GalleryClient from "./GalleryClient";

interface Task {
  id: string;
  title: string;
  emoji: string;
}

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("title, tasks")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!wedding) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, thumbnail_path, task_id, created_at")
    .eq("wedding_id", id)
    .order("created_at", { ascending: false });

  const tasks = (wedding.tasks as Task[]) || [];

  return (
    <GalleryClient 
      photos={photos || []} 
      tasks={tasks} 
      weddingTitle={wedding.title} 
    />
  );
}
