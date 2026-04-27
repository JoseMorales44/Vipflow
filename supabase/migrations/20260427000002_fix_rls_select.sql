-- 🔓 Fix RLS SELECT for Organizations
-- Description: Allow owners to see their own orgs even if they aren't members yet.

-- 1. Permitir que el dueño vea su organización (necesario para el .select() tras el insert)
DROP POLICY IF EXISTS "Owners can view their organization" ON public.organizations;
CREATE POLICY "Owners can view their organization" ON public.organizations
  FOR SELECT USING (auth.uid() = owner_id);

-- 2. Asegurar que el dueño pueda actualizar su organización
DROP POLICY IF EXISTS "Owners can update their organization" ON public.organizations;
CREATE POLICY "Owners can update their organization" ON public.organizations
  FOR UPDATE USING (auth.uid() = owner_id);

-- 3. Permitir que los miembros vean los Spaces (necesario para el onboarding)
DROP POLICY IF EXISTS "Members can view spaces" ON public.spaces;
CREATE POLICY "Members can view spaces" ON public.spaces
  FOR SELECT USING (auth.uid() = created_by);
