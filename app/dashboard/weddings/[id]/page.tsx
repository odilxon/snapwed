import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { QrCode, Users, Camera, CheckSquare, ExternalLink } from "lucide-react";
import PhotoGrid from "@/components/dashboard/PhotoGrid";

export default async function WeddingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: wedding } = await supabase
    .from("weddings")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user!.id)
    .single();

  if (!wedding) notFound();

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("wedding_id", id)
    .order("created_at", { ascending: false });

  const { data: sessions } = await supabase
    .from("guest_sessions")
    .select("id")
    .eq("wedding_id", id);

  const guestUrl = `${process.env.NEXT_PUBLIC_APP_URL}/w/${wedding.slug}`;
  const tasks = (wedding.tasks as Array<{ id: string; title: string; emoji: string }>) || [];
  const completedTasks = tasks.filter((t) =>
    photos?.some((p) => p.task_id === t.id)
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-gray-900">{wedding.title}</h1>
          <p className="text-gray-500 font-sans mt-1">
            {new Date(wedding.date).toLocaleDateString("ru-RU", {
              day: "numeric", month: "long", year: "numeric"
            })}
            {wedding.venue && ` · ${wedding.venue}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={guestUrl}
            target="_blank"
            className="flex items-center gap-2 text-sm font-sans text-gray-600 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
            Страница гостя
          </Link>
          <Link
            href={`/dashboard/weddings/${id}/invite`}
            className="flex items-center gap-2 text-sm font-sans font-semibold text-dark-bg bg-gold-400 hover:bg-gold-600 px-4 py-2 rounded-lg transition-colors"
          >
            <QrCode size={14} />
            QR-код
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Users, value: sessions?.length || 0, label: "Гостей" },
          { icon: Camera, value: photos?.length || 0, label: "Фото" },
          { icon: CheckSquare, value: `${completedTasks.length}/${tasks.length}`, label: "Заданий" },
          { icon: Camera, value: wedding.is_active ? "Активна" : "Завершена", label: "Статус" },
        ].map(({ icon: Icon, value, label }, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={16} className="text-gold-400" />
              <span className="text-xs text-gray-400 font-sans">{label}</span>
            </div>
            <p className="text-2xl font-display text-gray-900">{value}</p>
          </div>
        ))}
      </div>

      {/* Tasks */}
      {tasks.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="font-display text-lg text-gray-900 mb-4">Задания</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {tasks.map((task) => {
              const done = photos?.some((p) => p.task_id === task.id);
              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl text-sm font-sans ${
                    done ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"
                  }`}
                >
                  <span className="mr-1">{task.emoji}</span>
                  {task.title}
                  {done && <span className="ml-1">✓</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Photo Gallery */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-display text-lg text-gray-900 mb-4">
          Фотографии {photos?.length ? `(${photos.length})` : ""}
        </h2>
        <PhotoGrid photos={photos || []} />
      </div>
    </div>
  );
}
