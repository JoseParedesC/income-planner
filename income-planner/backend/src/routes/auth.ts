import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth, signToken, uid } from '../middleware/auth.js';

export const authRouter = Router();
authRouter.use(rateLimit({ windowMs: 15 * 60_000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Demasiados intentos, intenta más tarde' } }));

const creds = z.object({ email: z.string().email().toLowerCase(), password: z.string().min(8).max(100) });

authRouter.post('/register', async (req, res) => {
  const p = creds.extend({ name: z.string().trim().min(2).max(80) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'Datos inválidos (contraseña mínima de 8 caracteres)' });
  const hash = await bcrypt.hash(p.data.password, 10);
  try {
    const { rows } = await pool.query('INSERT INTO users (email, name, password_hash) VALUES ($1,$2,$3) RETURNING id, email, name', [p.data.email, p.data.name, hash]);
    res.status(201).json({ token: signToken(rows[0].id), user: rows[0] });
  } catch (e: any) {
    if (e.code === '23505') return res.status(409).json({ error: 'Ese correo ya está registrado' });
    throw e;
  }
});

authRouter.post('/login', async (req, res) => {
  const p = creds.safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'Datos inválidos' });
  const { rows } = await pool.query('SELECT id, email, name, password_hash FROM users WHERE email=$1', [p.data.email]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(p.data.password, u.password_hash))) return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  res.json({ token: signToken(u.id), user: { id: u.id, email: u.email, name: u.name } });
});

authRouter.get('/me', requireAuth, async (_req, res) => {
  const { rows } = await pool.query('SELECT id, email, name FROM users WHERE id=$1', [uid(res)]);
  if (!rows[0]) return res.status(401).json({ error: 'Usuario no encontrado' });
  res.json({ user: rows[0] });
});
