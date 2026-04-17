"use client";

import { FiUsers, FiCamera, FiCheckSquare, FiClock } from "react-icons/fi";

interface StatItem {
  label: string;
  value: string | number;
  icon: "users" | "camera" | "tasks" | "clock";
  color?: "amber" | "green" | "blue" | "gray";
}

const iconMap = {
  users: FiUsers,
  camera: FiCamera,
  tasks: FiCheckSquare,
  clock: FiClock,
};

const colorMap = {
  amber: "text-amber-500 bg-amber-50",
  green: "text-green-500 bg-green-50",
  blue: "text-blue-500 bg-blue-50",
  gray: "text-gray-500 bg-gray-50",
};

export default function StatsBar({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = iconMap[stat.icon];
        const colorClass = colorMap[stat.color || "amber"];

        return (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                {stat.label}
              </span>
            </div>
            <p className="text-2xl font-display text-gray-900">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
