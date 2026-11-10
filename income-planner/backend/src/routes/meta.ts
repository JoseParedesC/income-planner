import { Router } from 'express';
import { z } from 'zod';
import { UVT, YEARS, calcTax } from '../domain/tax.js';
import { DOCS, EDU, MILESTONES } from '../domain/content.js';
import { recommendations } from '../domain/recommendations.js';
import { inputsSchema, yearParam } from '../domain/schemas.js';

export const metaRouter = Router();

/** Contenido estático: años, UVT, documentos, hitos y cultura tributaria */
metaRouter.get('/meta', (_req, res) => res.json({ years: YEARS, uvt: UVT, docs: DOCS, milestones: MILESTONES, edu: EDU }));

/** Simulación pública (sin cuenta) + recomendaciones */
metaRouter.post('/simulate', (req, res) => {
  const p = z.object({ year: yearParam, inputs: inputsSchema, docsDone: z.number().int().min(0).max(DOCS.length).default(0) }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: 'Datos inválidos' });
  const { year, inputs, docsDone } = p.data;
  res.json({ result: calcTax(inputs, year), recommendations: recommendations(inputs, year, docsDone, DOCS.length) });
});
