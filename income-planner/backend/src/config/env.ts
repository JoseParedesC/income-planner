const isProd = process.env.NODE_ENV === 'production';
const need = (k: string, dev?: string) => {
  const v = process.env[k] ?? (isProd ? undefined : dev);
  if (!v) throw new Error(`Falta la variable de entorno ${k}`);
  return v;
};
export const env = {
  isProd,
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: need('DATABASE_URL', 'postgres://postgres:postgres@localhost:5432/income_planner'),
  jwtSecret: need('JWT_SECRET', 'dev-secret-no-usar-en-produccion'),
  pgssl: process.env.PGSSL === 'true',
  corsOrigin: process.env.CORS_ORIGIN,
};
