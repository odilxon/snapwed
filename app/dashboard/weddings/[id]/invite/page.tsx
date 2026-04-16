import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import QRDisplay from "@/components/dashboard/QRDisplay";

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

  const guestUrl = `${process.env.NEXT_PUBLIC_APP_URL}/w/${wedding.slug}`;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-display text-gray-900">Приглашение гостей</h1>
        <p className="text-gray-500 font-sans mt-1">{wedding.title}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code */}
        <QRDisplay url={guestUrl} weddingTitle={wedding.title} />

        {/* Guest preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-display text-lg text-gray-900 mb-4">Превью для гостей</h2>
          <div className="mx-auto max-w-[300px] bg-[#FFFBF8] rounded-3xl border-4 border-gray-200 overflow-hidden shadow-lg">
            <div className="h-32 bg-gradient-to-br from-gold-400/30 to-rose-warm/30 flex items-center justify-center">
              <span className="text-5xl">💍</span>
            </div>
            <div className="p-5 text-center">
              <h3 className="font-display text-gray-900 text-lg mb-1">{wedding.title}</h3>
              <p className="text-sm text-gray-400 font-sans mb-3">
                {new Date(wedding.date).toLocaleDateString("ru-RU", {
                  day: "numeric", month: "long", year: "numeric"
                })}
              </p>
              {wedding.venue && (
                <p className="text-xs text-gray-400 font-sans mb-3">📍 {wedding.venue}</p>
              )}
              <p className="text-sm text-gray-600 font-sans italic mb-4">
                &ldquo;{wedding.greeting_text}&rdquo;
              </p>
              <div className="bg-[#D4875A] text-white rounded-xl py-3 text-sm font-semibold font-sans">
                📸 Начать съёмку
              </div>
            </div>
          </div>

          <div className="mt-6 bg-amber-50 rounded-xl p-4 text-sm text-amber-700 font-sans">
            <p className="font-semibold mb-1">💡 Как поделиться:</p>
            <ul className="space-y-1 text-amber-600">
              <li>• Распечатайте QR и разместите на столах</li>
              <li>• Отправьте ссылку гостям в WhatsApp</li>
              <li>• Поставьте QR на входе в зал</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
