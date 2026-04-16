import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import LiveGallery from "@/components/guest/LiveGallery";
import { ArrowLeft } from "lucide-react";

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ weddingSlug: string }>;
}) {
  const { weddingSlug } = await params;
  const supabase = await createClient();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("id, title")
    .eq("slug", weddingSlug)
    .eq("is_active", true)
    .single();

  if (!wedding) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("id, storage_path, created_at")
    .eq("wedding_id", wedding.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });

  const { count: guestsCount } = await supabase
    .from("guest_sessions")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", wedding.id);

  return (
    <div className="min-h-screen bg-[#FFFBF8]">
      <div className="max-w-[430px] mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href={`/w/${weddingSlug}`} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={22} />
          </Link>
          <div>
            <h1 className="font-display text-xl text-gray-900">Галерея</h1>
            <p className="text-gray-400 text-sm font-sans">
              {photos?.length || 0} фото от {guestsCount || 0} гостей
            </p>
          </div>
        </div>

        <LiveGallery
          weddingId={wedding.id}
          initialPhotos={(photos || []).map((p) => ({ id: p.id, storage_path: p.storage_path }))}
        />
      </div>
    </div>
  );
}
