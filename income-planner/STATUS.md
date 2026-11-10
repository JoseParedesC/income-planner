# Income Planner · Estado de la implementación

## ✅ Implementado
**Estructura**: monorepo `income-planner` con dos proyectos, `backend/` y `frontend/` (npm workspaces, TypeScript estricto). El motor tributario vive solo en el backend (sin paquete compartido).

**Backend** (Node + Express 5 + PostgreSQL)
- Registro/login/me con bcrypt + JWT; zod; helmet; rate limit en `/auth`; CORS opcional.
- Persistencia por usuario y año: datos tributarios (JSONB), fecha DIAN y checklist. Migraciones automáticas con advisory lock.
- `/api/meta` (contenido) y `/api/simulate` (cálculo + recomendaciones). `/api/*` desconocido → 404 (corregido).
- Motor: tarifa art. 241 E.T., UVT 2023–2026, aportes, deducciones, aportes voluntarios, renta exenta 25 %, tope 40 % / 1.340 UVT, dependientes, retenciones, saldo, obligación de declarar, tarifa marginal.
- 8 pruebas unitarias en verde. Probado de extremo a extremo con PostgreSQL 16 (registro, guardado, checklist, simulación, 401, 404, SPA fallback).

**Frontend** (React 18 + Vite + framer-motion + lucide-react)
- Jerarquía **ui → domain → layout → pages**, contextos (Auth, Meta, Plan) y hooks.
- Animaciones: transición entre páginas (entrada/salida), cascada (stagger), contadores animados, barras/anillo de progreso, acordeón con altura animada, check dibujado, indicador de navegación con `layoutId`, lista de recomendaciones con `AnimatePresence`, skeletons. Respeta `prefers-reduced-motion`.
- Estilo: tokens de diseño, tipografía Inter variable (autoalojada), tema claro/oscuro con toggle, sidebar en escritorio y barra inferior en móvil, glassmorphism, sombras en capas, página de login en dos paneles.
- Responsive: barra lateral completa (≥1200px), solo iconos (960–1199px) y barra inferior (<960px); login ajustado a 100dvh sin scroll; rejillas fluidas con `min(100%, …)`; inputs a 16px (sin zoom en iOS); objetivos táctiles de 44px; ajustes para 560px, 360px y móvil horizontal.
- Páginas: Panorama, Mis datos (campos con separador de miles y autoguardado), Simulador (desglose, distribución del ingreso, escala de tarifas, recomendaciones), Documentos, Fechas, Aprende.

## ⏳ Pendiente
**Alta**
1. Validar normativa con contador/DIAN: UVT 2023–2026 (no verificados en línea), topes, orden de beneficios y casos no cubiertos (rentas de capital, no laborales, dividendos, ganancias ocasionales, pensiones, descuentos, anticipo).
2. Calendario DIAN oficial por dígito de NIT (hoy el usuario escribe su fecha) + notificaciones por correo/WhatsApp.
3. Pruebas de integración del API (supertest) y de componentes (Vitest + Testing Library); prueba visual/E2E (Playwright) — **la interfaz no se revisó en un navegador en esta sesión**, solo compila y pasa tipos.
4. Seguridad: recuperación de contraseña, verificación de correo, CSP, política de privacidad (Ley 1581).
**Media**
5. Libro mensual de ingresos/deducciones que alimente los totales anuales.
6. Carga de soportes por ítem del checklist (almacenamiento de archivos).
7. Comparador de escenarios y exportación del resumen a PDF.
8. Modo invitado (usar `/api/simulate` sin registro en el frontend).
9. Tipos de API duplicados en `frontend/src/types.ts` (generarlos desde zod/OpenAPI).
**Baja**
10. i18n, auditoría WCAG, PWA/offline, métricas y logs estructurados.
