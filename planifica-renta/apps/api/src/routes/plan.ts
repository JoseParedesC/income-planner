import { Router } from 'express';
import { z } from 'zod';
import { DOC_KEYS, YEARS, calcTax, emptyInputs } from '@pr/shared';
import { pool } from '../db.js';
import { requireAuth, uid } from '../auth.js';

export const planRouter = Router();

const num = z.number().min(0).max(1e13);
const inputsSchema = z.object({
  ing: num, aportes: num.nullable(), ret: num, vol: num, viv: num,
  prep: num, gmf: num, dep: z.number().int().min(0).max(30), pat: num, cons: num,
});
const yearParam = z.coerce.number().int().refine((y) => YEARS.includes(y), 'Año no soportado');

// Simulación pública (sin cuenta): útil para probar sin registrarse
planRouter.post('/simulate', (req, res) => {
  const p = z.object({ year: yearParam, inputs: inputsSchema }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'Datos inválidos' });
  res.json(calcTax(p.data.inputs, p.data.year));
});

planRouter.use(requireAuth);

planRouter.get('/tax/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  if (!y.success) return res.status(400).json({ error: 'Año no soportado' });
  const { rows } = await pool.query(
    "SELECT data, to_char(dian_date,'YYYY-MM-DD') AS dian_date FROM tax_years WHERE user_id=$1 AND year=$2",
    [uid(req), y.data]);
  res.json({ inputs: { ...emptyInputs(), ...(rows[0]?.data ?? {}) }, dianDate: rows[0]?.dian_date ?? null });
});

planRouter.put('/tax/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  const p = z.object({ inputs: inputsSchema, dianDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable() }).safeParse(req.body);
  if (!y.success || !p.success) return res.status(400).json({ error: 'Datos inválidos' });
  await pool.query(
    `INSERT INTO tax_years (user_id, year, data, dian_date) VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, year) DO UPDATE SET data=EXCLUDED.data, dian_date=EXCLUDED.dian_date, updated_at=now()`,
    [uid(req), y.data, JSON.stringify(p.data.inputs), p.data.dianDate]);
  res.json({ ok: true });
});

planRouter.get('/checklist/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  if (!y.success) return res.status(400).json({ error: 'Año no soportado' });
  const { rows } = await pool.query(
    'SELECT item_key FROM checklist_items WHERE user_id=$1 AND year=$2 AND done', [uid(req), y.data]);
  res.json({ done: rows.map((r) => r.item_key) });
});

planRouter.put('/checklist/:year/:key', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  const p = z.object({ done: z.boolean() }).safeParse(req.body);
  if (!y.success || !p.success || !DOC_KEYS.includes(req.params.key)) return res.status(400).json({ error: 'Datos inválidos' });
  await pool.query(
    `INSERT INTO checklist_items (user_id, year, item_key, done) VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, year, item_key) DO UPDATE SET done=EXCLUDED.done, updated_at=now()`,
    [uid(req), y.data, req.params.key, p.data.done]);
  res.json({ ok: true });
});
