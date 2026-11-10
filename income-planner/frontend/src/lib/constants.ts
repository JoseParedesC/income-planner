import type { TaxInputs, TaxResult } from '../types';

export const EMPTY_INPUTS: TaxInputs = { ing: 0, aportes: null, ret: 0, vol: 0, viv: 0, prep: 0, gmf: 0, dep: 0, pat: 0, cons: 0 };
export const DEMO_INPUTS: TaxInputs = { ing: 140_000_000, aportes: null, ret: 14_000_000, vol: 8_000_000, viv: 6_000_000, prep: 3_000_000, gmf: 400_000, dep: 1, pat: 150_000_000, cons: 30_000_000 };
export const EMPTY_RESULT: TaxResult = {
  uvt: 0, ing: 0, apo: 0, base: 0, viv: 0, prep: 0, gmf: 0, dep: 0, vol: 0, e25: 0, cap: 0, sum: 0, lim: 0, extraDep: 0,
  rlg: 0, tax: 0, ret: 0, saldo: 0, obligado: false, tasaEfectiva: 0, marginal: 0,
};
export const BRACKET_RATES = [0, 0.19, 0.28, 0.33, 0.35, 0.37, 0.39];
export const EASE = [0.22, 1, 0.36, 1] as const;
