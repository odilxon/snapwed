import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import TaskList from "@/components/guest/TaskList";

export default async function TasksPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = await params;
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, title, tasks, max_photos_per_guest")
    .eq("slug", weddingSlug)
    .eq("is_active", true)
    .single();

  if (!wedding) notFound();

  return (
    <div className="min-h-screen bg-[#FFFBF8]">
      <TaskList
        weddingId={wedding.id}
        weddingSlug={weddingSlug}
        weddingTitle={wedding.title}
        tasks={(wedding.tasks as Array<{ id: string; title: string; emoji: string }>) || []}
        maxPhotos={wedding.max_photos_per_guest}
      />
    </div>
  );
}
