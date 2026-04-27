import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";
import { SpaceContent } from "./space-content";
import { Column } from "@/types/dashboard";

export type SpaceMember = {
  id: string;
  user_id: string;
  role: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
    email: string;
  } | null;
};

export default async function SpacePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies();
  const { id } = await params;

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

  // 1. Cargar datos del Space
  const { data: space } = await supabase
    .from("spaces")
    .select("*")
    .eq("id", id)
    .single();

  if (!space) redirect("/dashboard/inbox");

  // 2. Cargar Columnas y Tareas
  const { data: columns } = await supabase
    .from("kanban_columns")
    .select(`*, tasks (*)`)
    .eq("space_id", id)
    .order("position");

  // 3. Cargar miembros del Space con sus perfiles
  const { data: members } = await supabase
    .from("space_members")
    .select("*, profiles(*)")
    .eq("space_id", id);

  return (
    <SpaceContent
      space={space}
      columns={(columns as unknown as Column[]) || []}
      members={(members as unknown as SpaceMember[]) || []}
    />
  );
}
