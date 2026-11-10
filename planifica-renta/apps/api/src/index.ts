import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { env } from './env.js';
import { migrate, pool } from './db.js';
import { authRouter } from './routes/auth.js';
import { planRouter } from './routes/plan.js';

const app = express();
app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
if (env.corsOrigin) app.use(cors({ origin: env.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  try { await pool.query('SELECT 1'); res.json({ ok: true }); }
  catch { res.status(503).json({ ok: false }); }
});
app.use('/api/auth', authRouter);
app.use('/api', planRouter);
app.use('/api', (_req, res) => res.status(404).json({ error: 'No encontrado' }));

// Frontend compilado (mismo servicio en Railway)
const webDist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../web/dist');
if (fs.existsSync(webDist)) {
  app.use(express.static(webDist));
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(webDist, 'index.html')));
}

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

async function main() {
  await migrate();
  app.listen(env.port, '0.0.0.0', () => console.log(`API escuchando en :${env.port}`));
}
main().catch((e) => { console.error(e); process.exit(1); });
