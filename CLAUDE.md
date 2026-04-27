# 🚀 VipFlow — Gestión Productiva para Agencias

> **Mentor para Claude:** Actúa como un Senior Full Stack Developer con 10+ años de experiencia.
> Explica CADA decisión técnica como si me estuvieras enseñando. Usa comentarios descriptivos
> en todo el código. Cuando generes código, primero explica QUÉ vas a hacer y POR QUÉ.
> Si hay varias formas de resolver algo, muéstrame las opciones y recomienda la mejor.

---

## 📌 ¿Qué es VipFlow?

VipFlow es una plataforma SaaS de gestión productiva para agencias digitales.
Objetivo: ser la alternativa open-source a ClickUp — mismas funcionalidades, mejor UX, costo $0 de infra inicial.

**Propuesta de valor:**
- Las agencias crean Spaces (uno por cliente)
- Dentro de cada Space: tareas Kanban, chat en vivo, archivos compartidos
- 3 roles: Admin (jefe), Trabajador (equipo), Cliente (solo revisa)

---

## 🛠️ Stack Tecnológico

```
Frontend:  Next.js 15 (App Router)
Backend:   Supabase (PostgreSQL + Auth + Storage + Realtime)
Estilos:   Tailwind CSS + shadcn/ui
Deploy:    Vercel (frontend) + Supabase cloud (backend)
Lenguaje:  TypeScript (SIEMPRE, nunca JavaScript puro)
```

### ¿Por qué este stack?

- **Next.js 15 App Router:** Renderizado híbrido (SSR + CSR). Las páginas cargan rápido (SEO) y son interactivas (UX). El App Router usa React Server Components — componentes que corren en el servidor y nunca envían JS innecesario al cliente.
- **Supabase:** Es como tener Firebase pero con PostgreSQL real. Nos da base de datos, autenticación, almacenamiento de archivos y WebSockets (Realtime) — todo en uno, gratis hasta escalar.
- **TypeScript:** Le dice a Claude (y a ti) qué tipo de dato espera cada función. Evita bugs antes de que ocurran. Si una función espera un `string` y le pasas un `number`, TypeScript grita antes de que el usuario lo vea.
- **shadcn/ui:** Componentes de UI que se copian directo a tu proyecto (no son una dependencia externa). Los puedes modificar libremente.

---

## 🗂️ Estructura de Carpetas

```
VipFlow/
│
├── app/                          # Next.js App Router — cada carpeta = una ruta URL
│   ├── (auth)/                   # Grupo de rutas de autenticación (el paréntesis no aparece en la URL)
│   │   ├── login/page.tsx        # → /login
│   │   └── register/page.tsx     # → /register
│   │
│   ├── (dashboard)/              # Rutas protegidas — solo usuarios autenticados
│   │   ├── layout.tsx            # Layout compartido: sidebar + header para todas las páginas del dashboard
│   │   ├── page.tsx              # → /  (home del dashboard)
│   │   ├── spaces/               # Lista de todos los Spaces
│   │   │   ├── page.tsx          # → /spaces
│   │   │   └── [spaceId]/        # [spaceId] = parámetro dinámico (el ID real va en la URL)
│   │   │       ├── page.tsx      # → /spaces/abc123  (vista del Space)
│   │   │       ├── kanban/       # Tablero de tareas
│   │   │       │   └── page.tsx  # → /spaces/abc123/kanban
│   │   │       ├── chat/         # Chat en tiempo real
│   │   │       │   └── page.tsx  # → /spaces/abc123/chat
│   │   │       └── files/        # Archivos del proyecto
│   │   │           └── page.tsx  # → /spaces/abc123/files
│   │   └── settings/             # Configuración de cuenta
│   │       └── page.tsx
│   │
│   └── api/                      # API Routes de Next.js (endpoints del servidor)
│       └── webhooks/             # Para recibir eventos externos (ej: Stripe)
│           └── route.ts
│
├── components/                   # Componentes React reutilizables
│   ├── ui/                       # Componentes base de shadcn/ui (botones, inputs, modals)
│   ├── layout/                   # Sidebar, Header, Navbar
│   ├── kanban/                   # Todo lo relacionado al tablero Kanban
│   ├── chat/                     # Componentes del chat
│   ├── files/                    # Upload y lista de archivos
│   └── spaces/                   # Cards y formularios de Spaces
│
├── lib/                          # Utilidades y configuraciones
│   ├── supabase/
│   │   ├── client.ts             # Cliente de Supabase para el NAVEGADOR (componentes cliente)
│   │   ├── server.ts             # Cliente de Supabase para el SERVIDOR (server components, API routes)
│   │   └── middleware.ts         # Refresca la sesión en cada request (mantiene al usuario logueado)
│   ├── utils.ts                  # Funciones helper genéricas (formatear fechas, strings, etc.)
│   └── validations.ts            # Schemas de validación con Zod (valida datos antes de enviarlos a la BD)
│
├── hooks/                        # Custom React Hooks — lógica reutilizable con estado
│   ├── useSpaces.ts              # Leer/crear/eliminar Spaces
│   ├── useTasks.ts               # Leer/mover/actualizar tareas del Kanban
│   ├── useChat.ts                # Mensajes en tiempo real con Supabase Realtime
│   └── useUser.ts                # Datos del usuario autenticado
│
├── types/                        # Tipos TypeScript globales del proyecto
│   ├── database.ts               # Tipos auto-generados por Supabase (corren: supabase gen types)
│   └── index.ts                  # Tipos personalizados del negocio
│
├── supabase/                     # Todo lo de Supabase
│   ├── migrations/               # Archivos SQL — cada cambio a la BD queda registrado aquí
│   │   └── 001_initial_schema.sql
│   └── seed.sql                  # Datos de prueba para desarrollo
│
├── middleware.ts                 # Middleware de Next.js — protege rutas antes de que carguen
├── .env.local                    # Variables de entorno LOCALES (nunca subir a GitHub)
├── .env.example                  # Plantilla de variables de entorno (sí se sube a GitHub)
└── CLAUDE.md                     # Este archivo — contexto del proyecto para Claude
```

---

## 🗃️ Base de Datos — Schema de Supabase

```sql
-- TABLA: users (manejada por Supabase Auth, extendemos con un perfil)
-- Supabase crea auth.users automáticamente. Nosotros creamos public.profiles
-- para guardar info extra del usuario (nombre, avatar, rol global).
profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  email         text NOT NULL,
  avatar_url    text,
  job_title     text,                             -- "FullStack Developer", "CEO", "Marketing Manager"
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
)
-- Nota: El cargo es global al perfil del usuario.

-- TABLA: spaces (proyectos/clientes)
-- Un Space es un canal de trabajo dedicado a un cliente específico.
spaces (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,            -- nombre del cliente o proyecto
  description text,
  color       text DEFAULT '#6366f1',   -- color identificador en la UI
  owner_id    uuid REFERENCES profiles(id),  -- quién creó el Space (siempre un admin)
  created_at  timestamptz DEFAULT now()
)

-- TABLA: space_members (quién tiene acceso a qué Space)
-- Relación muchos-a-muchos entre usuarios y Spaces con un rol específico.
space_members (
  id        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id  uuid REFERENCES spaces(id) ON DELETE CASCADE,   -- si se borra el Space, se borran los miembros
  user_id   uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role      text DEFAULT 'worker',  -- 'admin' | 'worker' | 'client' (puede diferir del rol global)
  joined_at timestamptz DEFAULT now(),
  UNIQUE(space_id, user_id)  -- un usuario no puede estar dos veces en el mismo Space
)

-- TABLA: tasks (tarjetas del Kanban)
tasks (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id    uuid REFERENCES spaces(id) ON DELETE CASCADE,
  title       text NOT NULL,
  description text,
  status      text DEFAULT 'todo',     -- 'todo' | 'in_progress' | 'review' | 'done'
  priority    text DEFAULT 'medium',   -- 'low' | 'medium' | 'high' | 'urgent'
  assignee_id uuid REFERENCES profiles(id),  -- quién tiene asignada la tarea
  due_date    date,
  position    integer DEFAULT 0,       -- orden dentro de la columna (para drag & drop)
  created_by  uuid REFERENCES profiles(id),
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
)

-- TABLA: messages (chat en tiempo real)
-- Supabase Realtime escucha cambios en esta tabla y los transmite instantáneamente.
messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id   uuid REFERENCES spaces(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id),
  content    text NOT NULL,
  created_at timestamptz DEFAULT now()
)

-- TABLA: files (archivos subidos a Supabase Storage)
-- El archivo real vive en Supabase Storage. Aquí guardamos la metadata.
files (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  space_id     uuid REFERENCES spaces(id) ON DELETE CASCADE,
  uploaded_by  uuid REFERENCES profiles(id),
  name         text NOT NULL,      -- nombre original del archivo
  size         bigint,             -- tamaño en bytes
  type         text,               -- MIME type (ej: 'image/png', 'application/pdf')
  storage_path text NOT NULL,      -- ruta en Supabase Storage (para generar la URL)
  created_at   timestamptz DEFAULT now()
)
```

---

## 🔐 Seguridad — Row Level Security (RLS)

RLS es la seguridad a nivel de base de datos de PostgreSQL/Supabase.
Significa que aunque alguien obtenga tu URL de Supabase, NO puede ver datos que no son suyos.
Cada tabla tiene políticas que dicen "solo puedes ver/modificar filas donde tú eres miembro".

```
Regla de oro: SIEMPRE habilitar RLS en todas las tablas.
Un usuario solo puede ver/editar datos de Spaces donde es miembro.
```

---

## 📋 Fases de Desarrollo

### ✅ FASE 1 — Semanas 1-2: Cimientos
**Objetivo:** Un usuario puede registrarse, crear un Space e invitar miembros.

- [ ] Setup inicial: Next.js + Supabase + Tailwind + shadcn/ui
- [ ] Schema de base de datos + migraciones
- [ ] Autenticación completa (registro, login, logout, recuperar contraseña)
- [ ] Crear, editar y eliminar Spaces
- [ ] Invitar miembros a un Space (por email)
- [ ] Sistema de roles básico (Admin / Worker / Client)
- [ ] Layout del dashboard (sidebar + header)

**Estado actual:** 🔴 No iniciado

---

### ⏳ FASE 2 — Semanas 3-4: Core del producto
**Objetivo:** El equipo puede gestionar trabajo y comunicarse dentro de cada Space.

- [ ] Tablero Kanban con columnas (Todo / In Progress / Review / Done)
- [ ] Crear, editar, mover y eliminar tareas
- [ ] Drag & drop en el Kanban
- [ ] Asignar tareas a miembros
- [ ] Chat en tiempo real (Supabase Realtime)
- [ ] Subida y descarga de archivos (Supabase Storage)
- [ ] Vista de archivos con preview

**Estado actual:** 🔴 No iniciado

---

### ⏳ FASE 3 — Semanas 5-6: Portal cliente + polish
**Objetivo:** El cliente tiene su propio portal para revisar avances sin ver el caos interno.

- [ ] Vista especial para rol "Cliente" (solo lectura, interfaz simplificada)
- [ ] Notificaciones en tiempo real
- [ ] Dashboard de estadísticas del Space
- [ ] Modo oscuro
- [ ] Responsive mobile
- [ ] Optimización de performance

**Estado actual:** 🔴 No iniciado

---

## 🎯 Sesión Actual de Trabajo

```
📅 Fecha: [ACTUALIZAR CADA SESIÓN]
🔧 Fase: FASE 1 — Setup inicial
📍 Último punto completado: Creación de CLAUDE.md
▶️  Próximo paso: Inicializar proyecto Next.js
```

### Log de progreso (actualizar al terminar cada sesión)

```
[FECHA] - Creado CLAUDE.md y estructura del proyecto
```

---

## ⚙️ Variables de Entorno Necesarias

```bash
# .env.local — crear este archivo en la raíz del proyecto, NUNCA subir a GitHub

# Supabase — las encuentras en: supabase.com → tu proyecto → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...  # clave pública (puede estar en el frontend)
SUPABASE_SERVICE_ROLE_KEY=eyJ...       # clave secreta (SOLO en el servidor, nunca en el frontend)

# Next.js
NEXTAUTH_SECRET=una-cadena-aleatoria-larga  # genera con: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

---

## 📏 Reglas de Código (para Claude)

### TypeScript
```typescript
// ✅ SIEMPRE tipar las props de componentes
interface TaskCardProps {
  task: Task           // el tipo Task viene de types/index.ts
  onMove: (taskId: string, newStatus: TaskStatus) => void
}

// ✅ SIEMPRE tipar el retorno de funciones async
async function getSpaceById(spaceId: string): Promise<Space | null> {
  // ...
}

// ❌ NUNCA usar 'any'
const data: any = ...  // esto anula todas las ventajas de TypeScript
```

### Componentes React
```typescript
// ✅ Comentar el propósito del componente
/**
 * TaskCard — Tarjeta individual del Kanban
 *
 * Muestra el título, asignado y prioridad de una tarea.
 * Al hacer click abre el modal de detalle.
 * Al hacer drag, permite moverla entre columnas.
 */
export function TaskCard({ task, onMove }: TaskCardProps) {
  // ...
}
```

### Llamadas a Supabase
```typescript
// ✅ SIEMPRE manejar errores en llamadas a Supabase
const { data, error } = await supabase
  .from('tasks')
  .select('*')
  .eq('space_id', spaceId)

// Verificar error ANTES de usar data
if (error) {
  console.error('Error al obtener tareas:', error.message)
  return null
}

return data  // aquí TypeScript sabe que data no es null
```

### Nombres
```
Archivos de componentes:  PascalCase  → TaskCard.tsx, SpaceHeader.tsx
Archivos de utilidades:   camelCase   → formatDate.ts, useSpaces.ts
Variables y funciones:    camelCase   → spaceId, getUserById
Constantes globales:      UPPER_CASE  → MAX_FILE_SIZE, TASK_STATUSES
Tipos e interfaces:       PascalCase  → Task, Space, UserRole
```

---

## 🔗 Comandos Útiles

```bash
# Iniciar el servidor de desarrollo
npm run dev

# Generar tipos de TypeScript desde Supabase (hacer después de cambiar el schema)
npx supabase gen types typescript --project-id TU_PROJECT_ID > types/database.ts

# Aplicar migraciones a Supabase
npx supabase db push

# Ver las migraciones pendientes
npx supabase migration list

# Instalar un componente de shadcn/ui
npx shadcn@latest add button
npx shadcn@latest add dialog
```

---

## 💡 Contexto para Claude — Cómo Trabajar Conmigo

1. **Explícame antes de codear:** Di qué vas a crear y por qué esa es la mejor forma.
2. **Código con comentarios:** Cada función, hook y componente debe tener comentario explicando su propósito.
3. **Un bloque a la vez:** No generes todo el proyecto de golpe. Fase por fase, módulo por módulo.
4. **Muéstrame los errores comunes:** Si hay un patrón que los juniors hacen mal, dímelo y muéstrame el correcto.
5. **Recomienda mejoras:** Si ves algo que se puede hacer mejor, dímelo aunque no te lo haya pedido.
6. **Al terminar cada sesión:** Actualiza la sección "Sesión Actual de Trabajo" con el progreso.