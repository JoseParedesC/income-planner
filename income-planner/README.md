# Income Planner

Aplicación web para la **planificación tributaria de personas naturales en Colombia** (renta, cédula general, rentas de trabajo).
Monorepo de **dos proyectos** en TypeScript: `backend` (Node + Express + PostgreSQL) y `frontend` (React + Vite).

```
income-planner/
├── backend/                 API REST + motor tributario + migraciones
│   ├── src/
│   │   ├── config/          variables de entorno
│   │   ├── db/              pool de pg y migraciones SQL automáticas
│   │   ├── domain/          tax.ts (cálculo), recommendations.ts, content.ts, schemas.ts (zod)
│   │   ├── middleware/      JWT
│   │   ├── routes/          auth · meta (+simulate) · tax · checklist
│   │   └── index.ts         servidor (también sirve frontend/dist)
│   └── test/                pruebas del motor tributario
├── frontend/                SPA React
│   └── src/
│       ├── api/             cliente HTTP
│       ├── context/         Auth · Meta · Plan (estado y autoguardado)
│       ├── hooks/           useDebouncedEffect, useTheme
│       ├── lib/             format, motion, routes, constants
│       ├── components/
│       │   ├── ui/          átomos: Button, Card, NumberField, AnimatedNumber, Accordion…
│       │   ├── domain/      moléculas: KpiCard, BreakdownTable, IncomeFlowChart, DocumentList…
│       │   └── layout/      AppShell, Sidebar, Topbar, PageTransition
│       ├── pages/           Dashboard, DataPage, Simulator, Documents, Dates, Learn, AuthPage
│       └── styles/          tokens, base, layout, components (CSS con variables, tema claro/oscuro)
├── railway.json · docker-compose.yml · .env.example
└── package.json             npm workspaces: backend, frontend
```

El cálculo vive **solo en el backend**; el frontend lo consulta en `POST /api/simulate` (con debounce) y recibe resultado y recomendaciones.

## Desarrollo local
```bash
docker compose up -d        # PostgreSQL :5432
npm install
npm run dev                 # backend :3000 + frontend :5173 (proxy /api)
npm test                    # pruebas del backend
npm run typecheck           # backend + frontend
```
Las migraciones se aplican solas al iniciar el backend.

## Despliegue en Railway (un servicio + PostgreSQL)
1. Sube el repo a GitHub y crea el proyecto en Railway desde ese repo.
2. Agrega el plugin **PostgreSQL** y en el servicio define `DATABASE_URL=${{Postgres.DATABASE_URL}}`, `JWT_SECRET` (cadena larga aleatoria) y `NODE_ENV=production`.
3. `railway.json` ya define build, start (`npm start`) y healthcheck `/api/health`.
4. Genera el dominio en Settings → Networking.

## API
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/health` | no | Estado y conexión a BD |
| GET | `/api/meta` | no | Años, UVT, documentos, hitos y contenido educativo |
| POST | `/api/simulate` | no | Cálculo + recomendaciones `{ year, inputs, docsDone }` |
| POST | `/api/auth/register` · `/login` | no | JWT 7 días (límite de 30 intentos / 15 min) |
| GET | `/api/auth/me` | sí | Usuario actual |
| GET/PUT | `/api/tax/:year` | sí | Datos tributarios y fecha DIAN del año |
| GET/PUT | `/api/checklist/:year[/:key]` | sí | Documentos marcados |

> Herramienta orientativa. Verifica UVT, topes, tarifas y fechas con la DIAN o un contador.
