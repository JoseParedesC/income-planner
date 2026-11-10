# Estado de la implementación

## ✅ Implementado
**Infraestructura**
- Monorepo con npm workspaces (`apps/api`, `apps/web`, `packages/shared`), TypeScript estricto en los tres.
- Despliegue Railway: `railway.json`, healthcheck, un solo servicio que sirve API + SPA; `docker-compose.yml` para Postgres local.
- Migraciones SQL automáticas al arrancar (tabla `schema_migrations`, con advisory lock).

**Backend (Node + Express 5 + PostgreSQL)**
- Registro, login y `/me` con bcrypt + JWT (7 días); validación con zod; helmet; CORS opcional.
- Persistencia por usuario y año gravable: datos tributarios (JSONB), fecha de declaración DIAN, checklist.
- Endpoint público `/api/simulate`.
- Probado de extremo a extremo contra PostgreSQL 16 real (registro, guardado, lectura, checklist, simulación, 401 sin token, SPA fallback).

**Motor tributario (`@pr/shared`)**
- Tarifa art. 241 E.T., UVT 2023–2026, aportes obligatorios, deducciones (vivienda, prepagada, dependientes, GMF), aportes voluntarios, renta exenta 25 %, tope global 40 % / 1.340 UVT, deducción adicional por dependientes, retenciones, saldo, obligación de declarar.
- Motor de recomendaciones (incluye simulación de ahorro por aportes voluntarios).
- 7 pruebas unitarias (`npm test`) en verde.

**Frontend (React + Vite)**
- Login/registro, Panorama, Mis datos (autoguardado con debounce), Simulador + recomendaciones, Documentos (12 ítems), Fechas (hitos + cuenta regresiva), Aprende. Selector de año, tema claro/oscuro automático, diseño responsive.

## ⏳ Pendiente
**Prioridad alta**
1. **Validar la normativa con un contador/DIAN**: UVT 2023–2026 (no verificados en línea), topes y orden de aplicación de beneficios; casos no cubiertos (rentas de capital, no laborales, dividendos, ganancias ocasionales, pensiones, rentas exentas especiales, descuentos tributarios, anticipo).
2. **Calendario DIAN oficial**: hoy el usuario escribe su fecha; falta cargar vencimientos por dígito de NIT por año (tabla en BD + cálculo automático) y alertas.
3. **Notificaciones** (correo/WhatsApp/push) de fechas y documentos pendientes.
4. Pruebas de integración del API (supertest + BD de prueba) y pruebas de componentes del frontend.
5. Seguridad de producción: rate limiting en `/auth/*`, recuperación de contraseña, verificación de correo, CSP, rotación de JWT, política de privacidad / Ley 1581 (habeas data).

**Prioridad media**
6. Registro mensual de ingresos y deducciones (libro de movimientos) que alimente los totales anuales en lugar de valores globales.
7. Carga de soportes (archivos) por ítem del checklist (almacenamiento tipo S3/volumen Railway).
8. Comparador de escenarios lado a lado y exportación del resumen a PDF.
9. Modo invitado en el frontend usando `/api/simulate` sin registro.
10. Ruta `/api/*` desconocida devuelve 401 (el middleware de auth corre antes del 404); mover el 404 antes de `requireAuth`.

**Prioridad baja**
11. Internacionalización, accesibilidad (auditoría WCAG), PWA/offline, panel de administración de contenido educativo, métricas y logs estructurados.
