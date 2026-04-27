-- Tabla de Mensajes de Chat para los Spaces
CREATE TABLE IF NOT EXISTS public.messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    uuid NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  sender_id   uuid NOT NULL REFERENCES public.profiles(id),
  content     text NOT NULL,
  attachments jsonb DEFAULT '[]'::jsonb,
  is_ai       boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Política: Los miembros pueden ver mensajes de sus espacios
CREATE POLICY "Members can view messages in their spaces" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.spaces s
      JOIN public.org_members m ON s.org_id = m.org_id
      WHERE s.id = messages.space_id AND m.user_id = auth.uid()
    )
  );

-- Política: Los miembros pueden enviar mensajes a sus espacios
CREATE POLICY "Members can send messages in their spaces" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.spaces s
      JOIN public.org_members m ON s.org_id = m.org_id
      WHERE s.id = space_id AND m.user_id = auth.uid()
    )
  );

-- Política: Los usuarios pueden borrar sus propios mensajes
CREATE POLICY "Users can delete their own messages" ON public.messages
  FOR DELETE USING (sender_id = auth.uid());
