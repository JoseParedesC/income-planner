import { z } from 'zod';
import { YEARS } from './tax.js';

const num = z.number().min(0).max(1e13);
export const inputsSchema = z.object({
  ing: num, aportes: num.nullable(), ret: num, vol: num, viv: num,
  prep: num, gmf: num, dep: z.number().int().min(0).max(30), pat: num, cons: num,
});
export const yearParam = z.coerce.number().int().refine((y) => YEARS.includes(y), 'Año no soportado');
