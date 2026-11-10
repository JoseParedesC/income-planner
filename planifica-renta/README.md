# PlanificaRenta

Prototipo de aplicación web para **planificación tributaria de personas naturales en Colombia**
(renta, cédula general, rentas de trabajo). Monorepo TypeScript: React + Node/Express + PostgreSQL.

```
apps/api        Express 5 + pg + zod + JWT (sirve también el frontend compilado)
apps/web        React 18 + Vite + react-router
packages/shared Motor de cálculo, constantes y contenido (usado por api y web)
```

## Desarrollo local
```bash
cp .env.example .env            # opcional; el API tiene valores por defecto en desarrollo
docker compose up -d            # PostgreSQL en :5432
npm install
npm run dev                     # API :3000 + Web :5173 (proxy /api)
npm test                        # pruebas del motor tributario
npm run typecheck
```
Las migraciones se aplican solas al iniciar el API.

## Despliegue en Railway (un solo servicio + Postgres)
1. Sube el repo a GitHub y crea un proyecto en Railway desde ese repo.
2. Agrega el plugin **PostgreSQL**; en el servicio web define:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET` = una cadena larga y aleatoria
   - `NODE_ENV` = `production`
3. `railway.json` ya define build (`npm ci --include=dev && npm run build`), start (`npm start`) y healthcheck `/api/health`.
4. Genera el dominio público en Settings → Networking.

El mismo servicio entrega la API (`/api/*`) y el frontend compilado (SPA).

## API
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | no | Estado y conexión a BD |
| POST | `/api/auth/register` · `/login` | no | Registro / ingreso (JWT 7 días) |
| GET | `/api/auth/me` | sí | Usuario actual |
| POST | `/api/simulate` | no | Simulación sin cuenta |
| GET/PUT | `/api/tax/:year` | sí | Datos tributarios y fecha DIAN del año |
| GET | `/api/checklist/:year` | sí | Documentos marcados |
| PUT | `/api/checklist/:year/:key` | sí | Marcar/desmarcar documento |

> Aviso: herramienta orientativa. Verifica UVT, topes, tarifas y fechas con la DIAN o un contador.
