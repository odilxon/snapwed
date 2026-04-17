"use client";

import Link from "next/link";
import { FiCalendar, FiMapPin, FiUsers, FiCamera } from "react-icons/fi";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface WeddingCardProps {
  wedding: {
    id: string;
    title: string;
    slug: string;
    date: string;
    venue: string | null;
    is_active: boolean;
    photos_count?: number;
    guests_count?: number;
  };
}

export default function WeddingCard({ wedding }: WeddingCardProps) {
  return (
    <Link
      href={`/dashboard/weddings/${wedding.id}`}
      className="block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-amber-200 transition-all hover:-translate-y-0.5 group"
    >
      <div className="h-32 bg-gradient-to-br from-amber-100 via-rose-50 to-amber-50 flex items-center justify-center relative">
        <div className="absolute top-3 right-3">
          <span
            className={`px-2.5 py-1 text-xs font-medium rounded-full ${
              wedding.is_active
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {wedding.is_active ? "Активна" : "Завершена"}
          </span>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <span className="text-3xl">💍</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="font-display text-lg text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
          {wedding.title}
        </h3>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4 text-amber-500" />
            <span>{format(new Date(wedding.date), "d MMMM yyyy", { locale: ru })}</span>
          </div>
          {wedding.venue && (
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-amber-500" />
              <span className="truncate">{wedding.venue}</span>
            </div>
          )}
        </div>

        {(wedding.photos_count !== undefined || wedding.guests_count !== undefined) && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
            {wedding.guests_count !== undefined && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <FiUsers className="w-4 h-4" />
                <span>{wedding.guests_count} гостей</span>
              </div>
            )}
            {wedding.photos_count !== undefined && (
              <div className="flex items-center gap-1.5 text-sm text-gray-500">
                <FiCamera className="w-4 h-4" />
                <span>{wedding.photos_count} фото</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
