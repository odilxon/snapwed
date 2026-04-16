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
    <div className="flex min-h-screen bg-[#F8F7F4]">
      <Sidebar userName={profile?.full_name || user.email} plan={profile?.plan} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
