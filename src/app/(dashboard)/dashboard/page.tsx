import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import DashboardOverview from "./dashboard-overview";

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all data in parallel
  const [profileRes, membershipRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase
      .from("org_members")
      .select("role, organizations(*)")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const profile = profileRes.data;
  const membership = membershipRes.data;
  const org = (membership?.organizations as unknown) as { id: string; name: string; plan: string } | null;
  const role = org?.id && (await supabase.from("organizations").select("owner_id").eq("id", org.id).single()).data?.owner_id === user.id
    ? "owner"
    : membership?.role || "worker";

  // Fetch spaces, tasks and recent tasks
  const spacesRes = org
    ? await supabase
        .from("spaces")
        .select("id, name, color, icon, created_at")
        .eq("org_id", org.id)
        .is("deleted_at", null)
        .order("name")
        .limit(6)
    : { data: [] };

  const spaceIds = spacesRes.data?.map((s) => s.id) || [];

  const [tasksRes, taskCountRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("id, title, priority, column_id, created_at, spaces(name)")
      .in("space_id", spaceIds.length > 0 ? spaceIds : ["__none__"])
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("tasks")
      .select("id", { count: "exact", head: true })
      .in("space_id", spaceIds.length > 0 ? spaceIds : ["__none__"]),
  ]);

  const stats = {
    spaces: spacesRes.data?.length || 0,
    totalTasks: taskCountRes.count || 0,
  };

  return (
    <DashboardOverview
      profile={profile}
      org={org}
      role={role}
      spaces={spacesRes.data || []}
      recentTasks={(tasksRes.data as unknown as RecentTask[]) || []}
      stats={stats}
    />
  );
}

export type RecentTask = {
  id: string;
  title: string;
  priority: string | null;
  column_id: string | null;
  created_at: string | null;
  spaces: { name: string } | null;
};
