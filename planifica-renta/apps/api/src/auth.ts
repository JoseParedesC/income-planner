import jwt from 'jsonwebtoken';
import type { NextFunction, Request, Response } from 'express';
import { env } from './env.js';

export interface AuthedRequest extends Request { userId: string }

export const signToken = (userId: string) => jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '7d' });

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const h = req.headers.authorization;
  if (!h?.startsWith('Bearer ')) return res.status(401).json({ error: 'No autenticado' });
  try {
    const p = jwt.verify(h.slice(7), env.jwtSecret) as { sub: string };
    (req as AuthedRequest).userId = p.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
}

export const uid = (req: Request): string => (req as unknown as AuthedRequest).userId;
