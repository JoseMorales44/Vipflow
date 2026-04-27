-- 🚀 VipFlow Initial Schema Migration
-- Description: Base tables, RLS policies, and core functions for VipFlow

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLES

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  email         text NOT NULL,
  avatar_url    text,
  job_title     text,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

-- Organizations (The Agency)
CREATE TABLE IF NOT EXISTS public.organizations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  logo_url    text,
  owner_id    uuid NOT NULL REFERENCES public.profiles(id),
  plan        text DEFAULT 'free',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Org Members
CREATE TABLE IF NOT EXISTS public.org_members (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role            text NOT NULL DEFAULT 'worker', -- 'owner', 'admin', 'worker'
  joined_at       timestamptz DEFAULT now(),
  UNIQUE(org_id, user_id)
);

-- Spaces (Projects/Clients)
CREATE TABLE IF NOT EXISTS public.spaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name        text NOT NULL,
  description text,
  color       text DEFAULT '#6366f1',
  icon        text DEFAULT '📁',
  status      text DEFAULT 'active',
  created_by  uuid NOT NULL REFERENCES public.profiles(id),
  deleted_at  timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Space Members
CREATE TABLE IF NOT EXISTS public.space_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id  uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id   uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role      text NOT NULL DEFAULT 'worker', -- 'admin', 'worker', 'client'
  joined_at timestamptz DEFAULT now(),
  UNIQUE(space_id, user_id)
);

-- Kanban Columns
CREATE TABLE IF NOT EXISTS public.kanban_columns (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id  uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  name      text NOT NULL,
  color     text DEFAULT '#94a3b8',
  position  integer NOT NULL DEFAULT 0,
  is_done   boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Tasks
CREATE TABLE IF NOT EXISTS public.tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  column_id   uuid NOT NULL REFERENCES public.kanban_columns(id),
  title       text NOT NULL,
  description text,
  priority    text DEFAULT 'medium', -- 'none', 'low', 'medium', 'high', 'urgent'
  due_date    date,
  position    integer DEFAULT 0,
  created_by  uuid NOT NULL REFERENCES public.profiles(id),
  deleted_at  timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Task Assignees
CREATE TABLE IF NOT EXISTS public.task_assignees (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_by uuid NOT NULL REFERENCES public.profiles(id),
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(task_id, user_id)
);

-- Task Comments
CREATE TABLE IF NOT EXISTS public.task_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id     uuid NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id),
  content     text NOT NULL,
  is_internal boolean DEFAULT true,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Messages (Chat)
CREATE TABLE IF NOT EXISTS public.messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id     uuid NOT NULL REFERENCES public.profiles(id),
  content     text NOT NULL,
  reply_to_id uuid REFERENCES public.messages(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- Files
CREATE TABLE IF NOT EXISTS public.files (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id        uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  task_id         uuid REFERENCES public.tasks(id) ON DELETE SET NULL,
  uploaded_by     uuid NOT NULL REFERENCES public.profiles(id),
  name            text NOT NULL,
  size            bigint NOT NULL,
  mime_type       text NOT NULL,
  storage_path    text NOT NULL,
  created_at      timestamptz DEFAULT now()
);

-- Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type        text NOT NULL,
  title       text NOT NULL,
  body        text,
  link        text,
  is_read     boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Activity Log
CREATE TABLE IF NOT EXISTS public.activity_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  user_id     uuid REFERENCES public.profiles(id),
  entity_type text NOT NULL,
  entity_id   uuid NOT NULL,
  action      text NOT NULL,
  metadata    jsonb,
  created_at  timestamptz DEFAULT now()
);

-- 3. FUNCTIONS & TRIGGERS

-- Function to check space membership
CREATE OR REPLACE FUNCTION public.is_space_member(p_space_id uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.space_members
    WHERE space_id = p_space_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user profile
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END $$;

-- 4. ROW LEVEL SECURITY (RLS)

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Organizations
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Org members can view their organization" ON public.organizations;
CREATE POLICY "Org members can view their organization" ON public.organizations
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.org_members WHERE org_id = id AND user_id = auth.uid()));

-- Spaces
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Space members can view their spaces" ON public.spaces;
CREATE POLICY "Space members can view their spaces" ON public.spaces
  FOR SELECT USING (public.is_space_member(id) AND deleted_at IS NULL);

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Space members can view tasks" ON public.tasks;
CREATE POLICY "Space members can view tasks" ON public.tasks
  FOR SELECT USING (public.is_space_member(space_id) AND deleted_at IS NULL);
DROP POLICY IF EXISTS "Space members can manage tasks" ON public.tasks;
CREATE POLICY "Space members can manage tasks" ON public.tasks
  FOR ALL USING (public.is_space_member(space_id));

-- Messages
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Space members can read messages" ON public.messages;
CREATE POLICY "Space members can read messages" ON public.messages
  FOR SELECT USING (public.is_space_member(space_id));
DROP POLICY IF EXISTS "Space members can send messages" ON public.messages;
CREATE POLICY "Space members can send messages" ON public.messages
  FOR INSERT WITH CHECK (public.is_space_member(space_id) AND auth.uid() = user_id);
