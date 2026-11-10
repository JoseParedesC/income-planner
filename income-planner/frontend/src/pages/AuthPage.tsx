import { motion } from 'framer-motion';
import { Bell, Calculator, FolderCheck, TrendingUp } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Brand } from '../components/layout/Brand';
import { Button, ThemeToggle } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { ease } from '../lib/motion';

const POINTS = [[Calculator, 'Simula tu impuesto de renta con las reglas vigentes.'], [FolderCheck, 'Organiza tus soportes y no olvides ningún documento.'], [Bell, 'Anticípate a las fechas clave y planifica a tiempo.']] as const;

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { if (mode === 'login') await login(f.email, f.password); else await register(f.name, f.email, f.password); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  }
  return (
    <div className="auth">
      <div className="auth__hero">
        <i className="auth__blob auth__blob--1" /><i className="auth__blob auth__blob--2" />
        <div className="brand"><span className="brand__logo" style={{ background: 'rgba(255,255,255,.2)', boxShadow: 'none' }}><TrendingUp size={20} strokeWidth={2.6} /></span><div><b>Income Planner</b><small style={{ color: 'rgba(255,255,255,.75)' }}>Planificación tributaria</small></div></div>
        <div className="auth__copy">
          <h2>Planifica tus impuestos antes de que lleguen las fechas.</h2>
          <div className="auth__list">{POINTS.map(([Icon, t], i) => (
            <motion.div key={t} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.5, ease }}><Icon size={20} /><span>{t}</span></motion.div>))}
          </div>
        </div>
        <small className="auth__foot" style={{ opacity: 0.75 }}>Para personas naturales asalariadas en Colombia</small>
      </div>
      <div className="auth__panel">
        <motion.form className="auth__form" onSubmit={submit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease }}>
          <div className="row" style={{ justifyContent: 'space-between' }}><div><h1>{mode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h1><p className="muted">{mode === 'login' ? 'Ingresa para continuar.' : 'Toma menos de un minuto.'}</p></div><ThemeToggle /></div>
          {mode === 'register' && <div className="field"><label htmlFor="name">Nombre</label><div className="input"><input id="name" required minLength={2} value={f.name} onChange={set('name')} autoComplete="name" /></div></div>}
          <div className="field"><label htmlFor="email">Correo</label><div className="input"><input id="email" type="email" required value={f.email} onChange={set('email')} autoComplete="email" /></div></div>
          <div className="field"><label htmlFor="pw">Contraseña<small>Mínimo 8 caracteres</small></label><div className="input"><input id="pw" type="password" required minLength={8} value={f.password} onChange={set('password')} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></div></div>
          {err && <p className="err" role="alert">{err}</p>}
          <Button type="submit" block loading={busy}>{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</Button>
          <Button type="button" variant="ghost" block onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>{mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}</Button>
        </motion.form>
      </div>
    </div>
  );
}
