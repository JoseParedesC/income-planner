export const DOCS = [
  { key: 'cert_ingresos', label: 'Certificado de ingresos y retenciones (empleador)' },
  { key: 'cert_bancarios', label: 'Certificados bancarios: saldos e intereses' },
  { key: 'cert_vivienda', label: 'Certificado de intereses de crédito de vivienda' },
  { key: 'prepagada', label: 'Soportes de medicina prepagada o seguros de salud' },
  { key: 'dependientes', label: 'Soportes de dependientes (registro civil, estudios)' },
  { key: 'voluntarios', label: 'Certificados de aportes voluntarios a pensión / AFC' },
  { key: 'facturas', label: 'Facturas electrónicas de compras deducibles' },
  { key: 'bienes', label: 'Soportes de bienes: escrituras, tarjeta de propiedad' },
  { key: 'exogena', label: 'Información exógena revisada en el portal DIAN' },
  { key: 'rut', label: 'RUT actualizado' },
  { key: 'firma', label: 'Firma electrónica (IFE) vigente' },
  { key: 'sugerida', label: 'Borrador de declaración sugerida revisado' },
] as const;
export const DOC_KEYS: string[] = DOCS.map((d) => d.key);

export const MILESTONES = [
  { month: 0, short: 'Ene', title: 'Reúne soportes', text: 'Arranca el año ordenando facturas y certificados.' },
  { month: 2, short: 'Mar', title: 'Certificado de ingresos', text: 'Tu empleador debe entregarte el certificado de ingresos y retenciones del año anterior.' },
  { month: 5, short: 'Jun', title: 'Revisa tu RUT y firma', text: 'Actualiza el RUT y verifica que tu firma electrónica no esté vencida.' },
  { month: 7, short: 'Ago', title: 'Abre la declaración', text: 'Inicia el periodo de declaración de renta (agosto–octubre según tus dígitos).' },
  { month: 9, short: 'Oct', title: 'Cierre del plazo', text: 'Últimos días para presentar sin sanción; revisa tu fecha exacta.' },
  { month: 10, short: 'Nov', title: 'Planifica el cierre', text: 'Evalúa aportes voluntarios, AFC y gastos deducibles pendientes.' },
  { month: 11, short: 'Dic', title: 'Aportes antes del 31', text: 'Los aportes voluntarios deben consignarse dentro del año gravable.' },
] as const;

export const EDU = [
  { title: '¿Qué es planificar tus impuestos?', text: 'Es organizar con anticipación tu información y usar de forma legal los beneficios que permite la norma. No es evadir: es conocer tus opciones para pagar lo justo.' },
  { title: '¿Quién debe declarar renta?', text: 'Quien supere topes de ingresos, patrimonio, consumos, compras o consignaciones, expresados en UVT y definidos cada año.' },
  { title: '¿Qué es la UVT?', text: 'La Unidad de Valor Tributario es la medida con que se expresan topes y tarifas. Cambia cada año; por eso puedes elegir el año gravable.' },
  { title: 'Rentas exentas y deducciones', text: 'Reducen tu base gravable: aportes voluntarios, intereses de vivienda, medicina prepagada, dependientes y el 25 % de renta exenta laboral, todos con límites.' },
  { title: 'Conserva tus soportes', text: 'La DIAN puede pedirte los documentos que respaldan lo declarado. Guárdalos ordenados y por año.' },
  { title: 'Declaración sugerida', text: 'La DIAN prepara un borrador con información de terceros. Revísalo: puede tener errores u omisiones y la responsabilidad final es tuya.' },
] as const;
