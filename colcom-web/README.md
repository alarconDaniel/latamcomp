# Latinoamérica Comparte - Plataforma Integral

Bienvenido al repositorio principal de **Latinoamérica Comparte**, una plataforma web diseñada para conectar personas, empresas y comunidades en un ecosistema de colaboración regional con presencia en **Colombia, Argentina, Chile y Ecuador**.

Este proyecto está dividido en dos partes principales: un **Frontend moderno e interactivo** orientado al público y a la gestión administrativa, y un **Backend robusto** para el manejo de datos, usuarios, y almacenamiento en la nube.

---

## 🚀 Arquitectura y Tecnologías (Stack)

El proyecto es una aplicación Fullstack desarrollada con las tecnologías más modernas y sólidas del mercado actual:

### 🎨 Frontend (`colcom-web`)
Una Single Page Application (SPA) optimizada para brindar una experiencia de usuario premium (UX/UI).

- **Framework Core:** [React 19](https://react.dev/) + [Vite 7](https://vitejs.dev/)
- **Estilos y Diseño:** [Tailwind CSS 3.4](https://tailwindcss.com/) para diseño responsivo y moderno.
- **Animaciones:** [Framer Motion 12](https://www.framer.com/motion/) para transiciones fluidas, contadores animados y efectos visuales de alta calidad.
- **Enrutamiento:** Router nativo personalizado y sincronizado con el backend.
- **Estructura Pública:** Landing pages dinámicas (`CountryAboutSection`, `CountryMissionAndCTA`) adaptables según el país seleccionado (colores, métricas, componentes visuales).
- **Portal Administrativo:** Dashboard protegido por autenticación JWT con acceso granular según el rol del usuario (`superadmin`, `admin_pais`, `editor`).

### ⚙️ Backend (`colcom-api`)
Una API RESTful estructurada, segura y escalable para servir al frontend.

- **Framework Core:** [NestJS 10](https://nestjs.com/) (Node.js con TypeScript).
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/) (conectado mediante el paquete nativo `pg`).
- **Almacenamiento (Storage):** [Supabase Storage JS](https://supabase.com/storage) para el manejo de archivos, imágenes y logos en la nube.
- **Autenticación y Seguridad:** 
  - [Passport.js](https://www.passportjs.org/) + Estrategia `passport-jwt`.
  - Encriptación de contraseñas con `bcryptjs`.
  - Roles (`superadmin`, `admin_pais`, `editor`) con validación automática (Guards).
- **Validación de Datos:** `class-validator` y `class-transformer` para sanitización de DTOs.
- **Documentación:** Swagger (OpenAPI) integrado.

---

## 📂 Estructura del Proyecto Frontend

```text
colcom-web/
├── public/                 # Favicons y manifest (apple-touch, android-chrome, etc.)
├── src/
│   ├── api/                # Servicios de conexión con el backend NestJS (axios/fetch)
│   ├── assets/             # Recursos estáticos: Logos, imágenes y videos locales
│   ├── components/         # Componentes reutilizables
│   │   ├── admin/          # Componentes del Dashboard Administrativo
│   │   ├── common/         # Componentes transversales (StatusBadge, AsyncState, etc.)
│   │   └── public/         # Componentes dinámicos de las Landing Pages de países
│   ├── data/               # Configuraciones estáticas (e.g., countryLogos.ts)
│   ├── hooks/              # Custom Hooks (useAuth, useCountry, etc.)
│   ├── layouts/            # Plantillas maestras (AdminLayout con sidebar dinámico)
│   ├── pages/              # Vistas principales (Públicas y Privadas)
│   ├── routes/             # Lógica de navegación
│   ├── utils/              # Funciones helper, constantes y formateadores
│   └── main.tsx            # Punto de entrada principal de React
├── index.html              # Plantilla HTML raíz
├── tailwind.config.js      # Tokens de diseño y paletas de colores por país
└── vite.config.js          # Configuración del empaquetador Vite (y Proxy)
```

---

## 🔐 Roles y Permisos (Sistema RBAC)

La plataforma cuenta con un sistema de control de acceso basado en roles (Role-Based Access Control) fuertemente tipado:

- **Superadmin (`superadmin`):** Acceso total. Puede gestionar todos los países, ver estadísticas globales, gestionar el contenido de toda la plataforma, editar administradores y responder a todas las solicitudes de contacto.
- **Administrador de País (`admin_pais`):** Su alcance está estrictamente atado a su `pais_id` / `pais_slug` (ej. Argentina). Solo puede ver su propio Dashboard, aprobar testimonios/noticias locales, y editar su propia información. **No tiene acceso a solicitudes globales**.
- **Editor (`editor`):** Rol con permisos limitados a la redacción y carga de noticias y testimonios bajo el flujo de aprobación de los administradores.

---

## 🛠️ Comandos Principales

### En el Frontend
```bash
# Instalar dependencias
npm install

# Levantar el servidor de desarrollo en local (expuesto al host)
npm run dev

# Construir para producción
npm run build
```

### En el Backend
```bash
# Instalar dependencias
pnpm install

# Levantar el servidor de desarrollo en modo watch
pnpm run dev

# Ejecutar el script semilla (para popular base de datos inicial)
pnpm run seed
```

---

## 💡 Flujo de Trabajo y Despliegue

Actualmente, el ciclo de despliegue del proyecto es administrado a través de **GitHub** y **Render**:
1. Los cambios son commiteados y pusheados a la rama `main` en el repositorio de GitHub.
2. Render detecta el push, ejecuta el proceso de compilación (`npm run build` o `nest build`) y publica la nueva versión tanto de la API web como del cliente Frontend automáticamente.

---

*Hecho con dedicación para transformar y unir a Latinoamérica.* 🌎
