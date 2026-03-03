# VECTOR · SOFTMIP 🛡️

**Sistema Operativo de Gestión Integral para Empresas MIP (Manejo Integrado de Plagas)**

Plataforma SaaS que optimiza operaciones, maximiza rentabilidad y garantiza cumplimiento normativo (ISO 9001, HACCP, BRC) para empresas de control de plagas en Latinoamérica.

---

## 🚀 Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **UI** | Tailwind CSS, Shadcn/UI (Radix), Framer Motion |
| **Estado** | React Query (TanStack), React Hook Form, Zod |
| **Backend** | Supabase (PostgreSQL, Auth, Storage, RLS) |
| **Testing** | Vitest, React Testing Library |
| **Gráficos** | Recharts |

## 📋 Requisitos Previos

- **Node.js** ≥ 18
- **npm** ≥ 9
- Cuenta de **Supabase** con proyecto configurado

## ⚡ Instalación y Setup Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/vector-matias.git
cd vector-matias

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con las credenciales de tu proyecto Supabase:
# VITE_SUPABASE_PROJECT_ID="tu_project_id"
# VITE_SUPABASE_PUBLISHABLE_KEY="tu_anon_key"
# VITE_SUPABASE_URL="https://tu_project_id.supabase.co"

# 4. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080/`

## 📦 Scripts Disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (HMR) |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build de producción |
| `npm run lint` | Análisis de código con ESLint |
| `npm run test` | Ejecutar tests con Vitest |
| `npm run test:watch` | Tests en modo watch |

## 🏗️ Estructura del Proyecto

```
vector-matias/
├── src/
│   ├── components/          # Componentes UI reutilizables (Shadcn + custom)
│   ├── contexts/            # Contextos React (AuthContext)
│   ├── hooks/               # Hooks custom (useCRM, useConfigData)
│   ├── integrations/        # Cliente Supabase + tipos auto-generados
│   ├── layouts/             # DashboardLayout
│   ├── pages/
│   │   ├── dashboard/       # Páginas protegidas del dashboard
│   │   ├── Index.tsx         # Landing page pública
│   │   ├── Login.tsx         # Autenticación
│   │   └── NotFound.tsx      # 404
│   └── App.tsx              # Router principal + providers
├── supabase/                # Configuración de Supabase (migrations)
├── public/                  # Assets estáticos
└── .env.example             # Plantilla de variables de entorno
```

## 🔐 Módulos del Sistema

| Módulo | Ruta | Estado |
|---|---|---|
| **Dashboard** | `/dashboard` | ✅ Funcional |
| **Clientes (CRM)** | `/dashboard/clients` | ✅ CRUD completo con Supabase |
| **Planificación / OT** | `/dashboard/planning` | 🔧 UI lista, integración pendiente |
| **Finanzas** | `/dashboard/finance` | 🔧 En desarrollo |
| **Inventario** | `/dashboard/inventory` | 🔧 En desarrollo |
| **Reportes** | `/dashboard/reports` | 🔧 En desarrollo |
| **Compliance** | `/dashboard/compliance` | 🔧 En desarrollo |
| **Configuración** | `/dashboard/config` | ✅ Solo admins |
| **Portal de Clientes** | `/dashboard/portal` | 🔧 En desarrollo |

## 👥 Roles de Usuario

| Rol | Acceso |
|---|---|
| `admin` | Acceso total, incluida Configuración |
| `supervisor` | Dashboard, Clientes, Planificación, Reportes |
| `tecnico` | Órdenes de trabajo asignadas |
| `administrativo` | Gestión de clientes y finanzas |

## 🗄️ Base de Datos (Supabase)

Tablas principales: `clients`, `client_sites`, `work_orders`, `profiles`, `user_roles`, `prospects`, `supplies`, `certificates`, `certifications`, `branches`, `action_programs`, `species`, entre otras.

Row Level Security (RLS) y funciones auxiliares (`is_admin`, `is_supervisor`, `has_role`) configuradas en Supabase.

## 📄 Licencia

Proyecto privado — © 2026 VECTOR. Todos los derechos reservados.
