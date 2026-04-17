import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QRDisplay from "@/components/dashboard/QRDisplay";
import { FiHeart, FiCalendar, FiMapPin, FiZap } from "react-icons/fi";
import { headers } from "next/headers";

export default async function InvitePage({
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

  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const guestUrl = `${protocol}://${host}/w/${wedding.slug}`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-gray-900">Приглашение гостей</h1>
        <p className="text-gray-500 mt-1">{wedding.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <QRDisplay url={guestUrl} weddingTitle={wedding.title} />

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg text-gray-900 mb-4">Превью для гостей</h2>
          <div className="mx-auto max-w-[280px] bg-[#FFFBF8] rounded-3xl border-4 border-gray-200 overflow-hidden shadow-lg">
            <div className="h-28 bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-white/80 backdrop-blur flex items-center justify-center">
                <FiHeart className="w-7 h-7 text-amber-500" />
              </div>
            </div>
            <div className="p-5 text-center">
              <h3 className="font-display text-gray-900 text-base mb-1">{wedding.title}</h3>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-1">
                <FiCalendar className="w-3 h-3" />
                {new Date(wedding.date).toLocaleDateString("ru-RU", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </div>
              {wedding.venue && (
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-3">
                  <FiMapPin className="w-3 h-3" />
                  {wedding.venue}
                </div>
              )}
              <p className="text-xs text-gray-500 italic mb-3 line-clamp-2">
                {wedding.greeting_text}
              </p>
              <div className="bg-gray-900 text-white rounded-xl py-3 text-sm font-medium">
                Начать съёмку
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-700 font-medium mb-2">
              <FiZap className="w-5 h-5" />
              Как поделиться:
            </div>
            <ul className="space-y-1.5 text-sm text-amber-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Распечатайте QR и разместите на столах
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Отправьте ссылку гостям в WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Поставьте QR на входе в зал
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
