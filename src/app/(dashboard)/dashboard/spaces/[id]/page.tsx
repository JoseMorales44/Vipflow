import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { 
  Plus, 
  MoreHorizontal, 
  Search,
  Settings,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function SpacePage({ params }: { params: Promise<{ id: string }> }) {
  const cookieStore = await cookies()
  const { id } = await params;
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 1. Cargar datos del Space
  const { data: space } = await supabase
    .from('spaces')
    .select('*')
    .eq('id', id)
    .single();

  if (!space) redirect('/dashboard/inbox');

  // 2. Cargar Columnas y Tareas
  const { data: columns } = await supabase
    .from('kanban_columns')
    .select(`
      *,
      tasks (*)
    `)
    .eq('space_id', id)
    .order('position');

  return <SpaceContent space={space} columns={columns || []} />;
}

import { SpaceContent } from "./space-content";

function LayoutGrid(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
  )
}

function ListIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
  )
}
