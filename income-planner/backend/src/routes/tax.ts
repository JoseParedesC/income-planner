import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { uid } from '../middleware/auth.js';
import { emptyInputs } from '../domain/tax.js';
import { inputsSchema, yearParam } from '../domain/schemas.js';

export const taxRouter = Router();

taxRouter.get('/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  if (!y.success) return res.status(400).json({ error: 'Año no soportado' });
  const { rows } = await pool.query("SELECT data, to_char(dian_date,'YYYY-MM-DD') AS dian_date FROM tax_years WHERE user_id=$1 AND year=$2", [uid(res), y.data]);
  res.json({ inputs: { ...emptyInputs(), ...(rows[0]?.data ?? {}) }, dianDate: rows[0]?.dian_date ?? null });
});

taxRouter.put('/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  const p = z.object({ inputs: inputsSchema, dianDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable() }).safeParse(req.body);
  if (!y.success || !p.success) return res.status(400).json({ error: 'Datos inválidos' });
  await pool.query(
    `INSERT INTO tax_years (user_id, year, data, dian_date) VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, year) DO UPDATE SET data=EXCLUDED.data, dian_date=EXCLUDED.dian_date, updated_at=now()`,
    [uid(res), y.data, JSON.stringify(p.data.inputs), p.data.dianDate]);
  res.json({ ok: true });
});
