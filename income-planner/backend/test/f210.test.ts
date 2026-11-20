import test from 'node:test';
import assert from 'node:assert/strict';
import { CASILLAS, F210FormatError, parseF210, toNumber } from '../src/domain/f210.js';

/** Formulario 210 simulado: números de casilla en su sitio + los valores indicados (por número de casilla) */
function form(values: Record<number, number>, extra: Record<string, unknown> = { AD5: 'UVT 2024', AD6: 47065 }) {
  const cells: Record<string, unknown> = { ...extra };
  for (const c of CASILLAS) { cells[c.label] = c.n; if (values[c.n] != null) cells[c.value] = values[c.n]; }
  return (a: string) => cells[a];
}

test('toNumber acepta formato colombiano', () => {
  assert.equal(toNumber('1.234.567'), 1234567); assert.equal(toNumber('$ 5.000,5'), 5000.5);
  assert.equal(toNumber('12,5'), 12.5); assert.equal(toNumber('abc'), null); assert.equal(toNumber(null), null);
});
test('mapea las casillas a los campos del planificador', () => {
  const r = parseF210(form({ 29: 150e6, 32: 120e6, 43: 20e6, 33: 9.6e6, 35: 8e6, 38: 6e6, 39: 3e6, 132: 14e6, 138: 1 }));
  assert.equal(r.year, 2024); assert.equal(r.uvtInFile, 47065);
  assert.deepEqual(r.inputs, { ing: 140e6, aportes: 9.6e6, ret: 14e6, vol: 8e6, viv: 6e6, prep: 3e6, gmf: 0, dep: 1, pat: 150e6 });
  assert.equal(r.warnings.length, 1); // otras deducciones sin separar
});
test('sin aportes en el archivo queda null (el motor estima el 8 %)', () => assert.equal(parseF210(form({ 32: 100e6 })).inputs.aportes, null));
test('rentas de capital / no laborales generan advertencia', () => assert.ok(parseF210(form({ 32: 1e6, 58: 5e6 })).warnings.some((w) => w.includes('capital'))));
test('el año se deduce de la UVT si falta el rótulo', () => assert.equal(parseF210(form({ 32: 1 }, { AD6: 49799 })).year, 2025));
test('formulario vacío avisa', () => assert.ok(parseF210(form({})).warnings.some((w) => w.includes('vacío'))));
test('un archivo que no es el 210 se rechaza', () => assert.throws(() => parseF210(() => undefined), F210FormatError));
