import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/dashboard/Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name, plan")
    .eq("id", user.id)
    .single();

  const profile = profileData as { full_name: string | null; plan: string } | null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={profile?.full_name || user.email} plan={profile?.plan} />
      <main className="flex-1 overflow-auto md:ml-[260px]">
        <div className="max-w-7xl mx-auto md:p-8 p-4 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
