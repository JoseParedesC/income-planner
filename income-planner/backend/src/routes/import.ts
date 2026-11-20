import express, { Router } from 'express';
import ExcelJS from 'exceljs';
import { F210FormatError, parseF210 } from '../domain/f210.js';

export const importRouter = Router();

/** Valor de una celda de ExcelJS → primitivo (fórmulas: resultado en caché; texto enriquecido: texto plano) */
function plain(v: ExcelJS.CellValue): unknown {
  if (v == null || typeof v !== 'object' || v instanceof Date) return v instanceof Date ? null : v;
  if ('result' in v) return plain(v.result as ExcelJS.CellValue);
  if ('richText' in v) return v.richText.map((t) => t.text).join('');
  if ('text' in v) return v.text;
  return null;
}

/** Cuerpo binario (.xlsx) → lectura del Formulario 210. Sube el archivo tal cual, sin multipart ni base64. */
importRouter.post('/f210', express.raw({ type: () => true, limit: '5mb' }), async (req, res) => {
  const buf = req.body as Buffer;
  if (!Buffer.isBuffer(buf) || buf.length < 4 || buf[0] !== 0x50 || buf[1] !== 0x4b)
    return res.status(400).json({ error: 'Sube un archivo Excel (.xlsx)' });
  try {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.load(buf as unknown as ArrayBuffer);
    const ws = wb.getWorksheet('210') ?? wb.worksheets[0];
    if (!ws) throw new F210FormatError('El libro no tiene hojas.');
    res.json(parseF210((addr) => plain(ws.getCell(addr).value)));
  } catch (e) {
    if (e instanceof F210FormatError) return res.status(422).json({ error: e.message });
    res.status(400).json({ error: 'No se pudo leer el archivo. Verifica que sea un .xlsx válido' });
  }
});
