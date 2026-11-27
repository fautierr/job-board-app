# Job Board (frontend)

Aplicación web de una bolsa de trabajo donde los candidatos buscan ofertas y se postulan, y los empleadores publican y gestionan sus propias ofertas. Es el cliente React de un proyecto full stack; el backend vive en un repositorio independiente.

## Objetivo

Sirve como proyecto de portfolio: una interfaz completa, responsive y profesional, construida con React y TypeScript, que consume una API REST real con autenticación por JWT y permisos por rol. El foco está en la claridad de la experiencia de usuario y en una arquitectura de frontend mantenible.

## Funcionalidades

### Candidatos

- Explorar ofertas publicadas con búsqueda por texto y filtros (categoría, seniority, modalidad, jornada y tipo de contrato).
- Navegar el listado con paginación y ver el detalle de cada oferta.
- Registrarse como candidato e iniciar sesión.
- Postularse a una oferta enviando únicamente nombre y teléfono; la interfaz indica “Ya postulado” cuando corresponda.
- Consultar el historial de postulaciones propias.

### Empleadores

- Registrarse con nombre de empresa e iniciar sesión.
- Crear, editar y listar sus ofertas.
- Publicar, pausar y cerrar ofertas según las transiciones permitidas por la API.
- Consultar las postulaciones recibidas por oferta.

El acceso a las secciones de candidato y empleador está protegido por autenticación y por rol.

## Tecnologías

Todo lo listado está instalado en este repositorio:

- **Aplicación:** React 19, React DOM 19, React Router 7, Vite 8, TypeScript 5.9.
- **Estilos:** Tailwind CSS 4 (configuración CSS-first con `@tailwindcss/vite`) e Inter cargada localmente con `@fontsource-variable/inter`.
- **Testing:** Vitest 5, jsdom 31 y React Testing Library 16 (`@testing-library/dom` 10).
- **Calidad:** ESLint 10 con `typescript-eslint`, `eslint-plugin-react-hooks` y `eslint-plugin-react-refresh`.

No se usan herramientas E2E, librerías de animación ni clientes HTTP externos: las solicitudes se hacen con `fetch` nativo.

## Arquitectura y organización

`src/main.tsx` monta la aplicación con `BrowserRouter`, el proveedor de autenticación y el sistema de notificaciones. `src/app/router.tsx` declara las rutas públicas, las de acceso y las protegidas por rol; `src/app/guards` y `src/app/layouts` contienen esas protecciones y los layouts compartidos.

Las responsabilidades están separadas por dominio:

| Carpeta | Responsabilidad |
|---|---|
| `src/api` | Cliente `fetch` centralizado y normalización de errores de la API. |
| `src/auth` | Sesión, JWT, registro/login y estado de autenticación. |
| `src/offers` | Consulta pública de ofertas, filtros, tipos y formato. |
| `src/employer` | Operaciones de empleador sobre ofertas y estados. |
| `src/applications` | Postulaciones del candidato y de cada oferta. |
| `src/pages`, `src/components` | Pantallas y componentes de presentación. |
| `src/styles` | Tokens de diseño y estilos globales de Tailwind. |
| `src/test` | Helpers, fixtures y setup de los tests automatizados. |

`index.html` es la única entrada de la aplicación y compila en `dist/`.

## Integración con el backend

El frontend consume la API REST documentada en `docs/API_CONTRACT.md` del repositorio backend (ese contrato es la fuente de verdad; acá no se reproduce su detalle). Los módulos utilizados son autenticación, ofertas y postulaciones.

- La URL base se obtiene de `VITE_API_BASE_URL` y se usa en `src/api/http.ts`; no hay una URL de producción fija en el código.
- El JWT se guarda en `localStorage` y se envía como header `Authorization: Bearer <token>` en las operaciones autenticadas.
- Los identificadores de usuario y los roles nunca se envían en los bodies: se derivan del token y se validan en el backend.
- Las respuestas y los errores se parsean según el contrato; la interfaz muestra mensajes de validación y de error sin exponer datos sensibles.
- CORS se configura en el backend: el origen del frontend debe figurar en `CORS_ALLOWED_ORIGINS`. Esto no está resuelto automáticamente por el despliegue.

## Requisitos previos

- **Node.js 22.22.3**, fijado en `.node-version`. Vite 8 acepta Node `^20.19` o `>=22.12`, y jsdom 31 requiere `>=22.22.2`.
- **npm** (verificado con 11.2.0).
- Un backend en ejecución para usar la aplicación. Los tests no lo necesitan.

## Instalación

```bash
npm ci
cp .env.example .env
```

Editar `.env` con la URL base del backend correspondiente al entorno. Para desarrollo local, por ejemplo:

```dotenv
VITE_API_BASE_URL=http://localhost:3000/api
```

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---|---|
| `VITE_API_BASE_URL` | Sí | URL base de la API, incluido el prefijo `/api`. Se usa en build y en desarrollo. |

No hay secretos en el frontend: las variables `VITE_*` terminan incluidas en el bundle, por lo que nunca deben contener contraseñas, claves ni tokens. `.env` está ignorado por Git; `.env.example` es solo una plantilla.

## Ejecución en desarrollo

```bash
npm run dev
```

La aplicación queda disponible en `http://localhost:5173` (ruta inicial: `/offers`).

## Tests

```bash
npm test          # suite completa, una sola ejecución
npm run test:watch
```

La suite tiene 12 tests en 5 archivos. Cubre login, registro, guards por rol, creación de ofertas y postulaciones. La capa de API se mockea: no se crean usuarios, ofertas ni postulaciones reales.

## Build de producción

```bash
npm run build
```

Ejecuta `tsc -b` y luego `vite build`. El resultado queda en `dist/` y contiene únicamente la aplicación principal (`index.html` y sus assets). Para revisarlo localmente:

```bash
npm run preview
```

## Preparación para Cloudflare Pages

El repositorio está listo para importarse desde **Cloudflare Dashboard → Workers & Pages → Create application → Pages → Import an existing Git repository** con:

| Opción | Valor |
|---|---|
| Framework preset | React (Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | raíz del repositorio |

Configurar `VITE_API_BASE_URL` en **Settings → Environment variables** tanto para Production como para Preview, con la URL real del backend.

No se agregó `_redirects` ni `404.html`: Cloudflare Pages ya sirve `index.html` como fallback para rutas del cliente cuando no hay un asset que coincida, siempre que no exista un `404.html` en la raíz del output. Las rutas principales (`/offers`, `/offers/:offerId`, `/login`, `/register`, `/candidate/applications`, `/employer/offers`, `/employer/offers/new`, `/employer/offers/:offerId/edit` y `/employer/offers/:offerId/applications`) funcionan con ese comportamiento.

La versión de Node se fija mediante `.node-version`, que Cloudflare Pages respeta durante el build.

## Estado del despliegue

El despliegue todavía no se realizó. Antes de hacerlo falta definir la URL definitiva del backend, configurar la variable de entorno en Cloudflare Pages y habilitar el dominio del frontend en `CORS_ALLOWED_ORIGINS` del backend.
