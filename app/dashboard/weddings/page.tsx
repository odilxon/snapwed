import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus, QrCode, Image } from "lucide-react";

export default async function WeddingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: weddings } = await supabase
    .from("weddings")
    .select("*")
    .eq("owner_id", user!.id)
    .order("created_at", { ascending: false });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display text-gray-900">Мои свадьбы</h1>
          <p className="text-gray-500 font-sans mt-1">Управляйте своими свадебными событиями</p>
        </div>
        <Link
          href="/dashboard/weddings/new"
          className="flex items-center gap-2 bg-gold-400 hover:bg-gold-600 text-dark-bg font-semibold px-5 py-2.5 rounded-lg transition-colors font-sans"
        >
          <Plus size={18} />
          Новая свадьба
        </Link>
      </div>

      {!weddings?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">
          <div className="text-5xl mb-4">💍</div>
          <h2 className="text-xl font-display text-gray-900 mb-2">Создайте первую свадьбу</h2>
          <p className="text-gray-400 font-sans mb-6 max-w-sm mx-auto">
            Создайте свадьбу, получите QR-код и гости начнут отправлять фото
          </p>
          <Link
            href="/dashboard/weddings/new"
            className="inline-flex items-center gap-2 bg-gold-400 hover:bg-gold-600 text-dark-bg font-semibold px-8 py-3 rounded-lg transition-colors font-sans"
          >
            <Plus size={18} />
            Создать свадьбу
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weddings.map((wedding) => (
            <div key={wedding.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-gold-50 to-rose-pale flex items-center justify-center">
                <span className="text-4xl">💍</span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-gray-900 text-lg mb-1">{wedding.title}</h3>
                <p className="text-sm text-gray-400 font-sans mb-1">
                  {new Date(wedding.date).toLocaleDateString("ru-RU", {
                    day: "numeric", month: "long", year: "numeric"
                  })}
                </p>
                {wedding.venue && (
                  <p className="text-sm text-gray-400 font-sans mb-3">📍 {wedding.venue}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-sans ${
                    wedding.is_active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                  }`}>
                    {wedding.is_active ? "Активна" : "Завершена"}
                  </span>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link
                    href={`/dashboard/weddings/${wedding.id}`}
                    className="flex-1 text-center text-sm font-sans font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <Image size={14} />
                    Галерея
                  </Link>
                  <Link
                    href={`/dashboard/weddings/${wedding.id}/invite`}
                    className="flex-1 text-center text-sm font-sans font-medium text-gold-400 bg-gold-50 hover:bg-gold-100 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1"
                  >
                    <QrCode size={14} />
                    QR-код
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
