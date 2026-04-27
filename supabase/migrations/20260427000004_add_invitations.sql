-- 🚀 VipFlow Invitations Migration
-- Description: Adds invitations table for agency onboarding

CREATE TABLE IF NOT EXISTS public.invitations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  email       text, -- Optional: if restricted to a specific email
  role        text NOT NULL DEFAULT 'worker', -- 'admin', 'worker', 'client'
  status      text NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'expired'
  invited_by  uuid NOT NULL REFERENCES public.profiles(id),
  expires_at  timestamptz DEFAULT (now() + interval '7 days'),
  created_at  timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Only admins/owners of the org can view/create invitations
CREATE POLICY "Admins can manage invitations" ON public.invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.org_members 
      WHERE org_id = invitations.org_id 
      AND user_id = auth.uid() 
      AND role IN ('owner', 'admin')
    )
  );

-- Anyone with the ID can view a specific invitation (to accept it)
CREATE POLICY "Public can view invitation by ID" ON public.invitations
  FOR SELECT USING (true);
