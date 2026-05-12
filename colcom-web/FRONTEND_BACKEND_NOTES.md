# FRONTEND_BACKEND_NOTES

## Endpoints usados
- `GET /api/public/countries`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/profile/me`
- `GET /api/countries`, `GET /api/countries/active`
- `GET /api/news/public/:countrySlug`
- `GET /api/news/public/:countrySlug/:newsSlug`
- `GET /api/news`, `GET /api/news/:id`, `POST /api/news`, `PUT /api/news/:id`, `DELETE /api/news/:id`
- `GET /api/testimonials/public/:countrySlug`
- `GET /api/testimonials`, `GET /api/testimonials/:id`, `POST /api/testimonials`, `PUT /api/testimonials/:id`, `DELETE /api/testimonials/:id`
- `POST /api/contact-requests/public`
- `GET /api/contact-requests`, `GET /api/contact-requests/:id`, `PUT /api/contact-requests/:id/status`, `DELETE /api/contact-requests/:id`

## Endpoints faltantes o diferencias
- En la verificacion local del endpoint `GET /api/public/countries`, los datos activos devueltos fueron `Argentina`, `Chile` y `Ecuador`. El requerimiento menciona `Colombia`, pero el frontend usa los slugs reales que entregue el backend para no inventar paises.
- No existe endpoint de dashboard/metricas. El frontend calcula tarjetas consultando listados existentes.
- No existe endpoint de donaciones. `/donaciones` queda como pagina informativa con enlace a contacto.
- No existe creacion de paises; solo listado y actualizacion en backend. La pantalla de paises lista datos.
- El backend exige `foto_url` al crear testimonios, aunque el sitio publico soporta placeholder si una respuesta llega sin foto.
- Contacto publico requiere `pais_id`, no slug de pais. El frontend resuelve el pais activo contra `GET /api/public/countries`.

## Variables de entorno frontend
```dotenv
VITE_API_URL=http://localhost:3001/api
VITE_STITCH_API_KEY=
```

`VITE_STITCH_API_KEY` queda documentada pero no se usa en el navegador para no exponer una clave sensible.

## Instrucciones locales
Backend:
```bash
cd colcom-api
npm install
npm run dev
```

Frontend:
```bash
cd colcom-web
npm install
npm run dev
```

## Credenciales de prueba
El README del backend muestra un ejemplo conceptual `superadmin` / `123456`, pero no hay seed verificable en el repositorio. Usar las credenciales existentes en Supabase o crear un superadmin con `src/scripts/createSuperAdmin.js` si el script esta configurado para el entorno.

## CORS
El backend usa `app.use(cors())`, por lo que acepta el origen de Vite en desarrollo. En produccion conviene restringir `origin` al dominio real del frontend.
