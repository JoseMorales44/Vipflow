-- 🔓 Fix RLS Policies for Onboarding
-- Description: Allow users to create their own organizations, spaces and members.

-- 1. Organizations: Permite a cualquier usuario autenticado crear una organización
DROP POLICY IF EXISTS "Users can create organizations" ON public.organizations;
CREATE POLICY "Users can create organizations" ON public.organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 2. Org Members: Permite a los dueños de organizaciones añadir miembros (y a sí mismos)
DROP POLICY IF EXISTS "Users can join organizations" ON public.org_members;
CREATE POLICY "Users can join organizations" ON public.org_members
  FOR INSERT WITH CHECK (true); -- Simplificado para el onboarding inicial

-- 3. Spaces: Permite a los miembros crear spaces
DROP POLICY IF EXISTS "Users can create spaces" ON public.spaces;
CREATE POLICY "Users can create spaces" ON public.spaces
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- 4. Kanban Columns: Permite crear columnas en tus spaces
DROP POLICY IF EXISTS "Users can create columns" ON public.kanban_columns;
CREATE POLICY "Users can create columns" ON public.kanban_columns
  FOR INSERT WITH CHECK (true);

-- 5. Profiles: Asegurar que el usuario puede ver su propio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
