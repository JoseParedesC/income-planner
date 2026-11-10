import test from 'node:test';
import assert from 'node:assert/strict';
import { calcTax, incomeTax, emptyInputs, UVT } from '../dist/index.js';

test('tarifa: 0 % hasta 1.090 UVT', () => assert.equal(incomeTax(1090 * UVT[2026], UVT[2026]), 0));
test('tarifa: 1.700 UVT = 115,9 UVT de impuesto', () => {
  const u = UVT[2026]; assert.ok(Math.abs(incomeTax(1700 * u, u) - 115.9 * u) < 1);
});
test('sin ingresos no hay impuesto ni obligación', () => {
  const r = calcTax(emptyInputs(), 2026); assert.equal(r.tax, 0); assert.equal(r.obligado, false);
});
test('aportes vacíos se estiman en 8 %', () => {
  assert.equal(calcTax({ ...emptyInputs(), ing: 100_000_000 }, 2026).apo, 8_000_000);
});
test('el tope global limita los beneficios', () => {
  const r = calcTax({ ...emptyInputs(), ing: 300_000_000, vol: 90_000_000, viv: 60_000_000 }, 2026);
  assert.ok(r.lim <= r.cap + 1);
});
test('año no soportado lanza error', () => assert.throws(() => calcTax(emptyInputs(), 1999)));
test('saldo a favor si las retenciones superan el impuesto', () => {
  assert.ok(calcTax({ ...emptyInputs(), ing: 140_000_000, ret: 50_000_000 }, 2026).saldo < 0);
});
