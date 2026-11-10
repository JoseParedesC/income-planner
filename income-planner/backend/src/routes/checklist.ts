import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { uid } from '../middleware/auth.js';
import { DOC_KEYS } from '../domain/content.js';
import { yearParam } from '../domain/schemas.js';

export const checklistRouter = Router();

checklistRouter.get('/:year', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  if (!y.success) return res.status(400).json({ error: 'Año no soportado' });
  const { rows } = await pool.query('SELECT item_key FROM checklist_items WHERE user_id=$1 AND year=$2 AND done', [uid(res), y.data]);
  res.json({ done: rows.map((r) => r.item_key) });
});

checklistRouter.put('/:year/:key', async (req, res) => {
  const y = yearParam.safeParse(req.params.year);
  const p = z.object({ done: z.boolean() }).safeParse(req.body);
  if (!y.success || !p.success || !DOC_KEYS.includes(req.params.key)) return res.status(400).json({ error: 'Datos inválidos' });
  await pool.query(
    `INSERT INTO checklist_items (user_id, year, item_key, done) VALUES ($1,$2,$3,$4)
     ON CONFLICT (user_id, year, item_key) DO UPDATE SET done=EXCLUDED.done, updated_at=now()`,
    [uid(res), y.data, req.params.key, p.data.done]);
  res.json({ ok: true });
});
