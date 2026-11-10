import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(''); setBusy(true);
    try { mode === 'login' ? await login(f.email, f.password) : await register(f.name, f.email, f.password); }
    catch (x) { setErr((x as Error).message); } finally { setBusy(false); }
  }
  return (
    <div className="authwrap"><form className="card auth" onSubmit={submit}>
      <h1>🧾 PlanificaRenta</h1>
      <p className="mu">Organiza tu información tributaria y simula tu renta con anticipación.</p>
      {mode === 'register' && <div><label>Nombre<input required minLength={2} value={f.name} onChange={set('name')} /></label></div>}
      <div><label>Correo<input type="email" required value={f.email} onChange={set('email')} /></label></div>
      <div><label>Contraseña<small>Mínimo 8 caracteres</small><input type="password" required minLength={8} value={f.password} onChange={set('password')} /></label></div>
      {err && <p className="err">{err}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Un momento…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
      <button type="button" className="btn soft" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setErr(''); }}>
        {mode === 'login' ? 'No tengo cuenta' : 'Ya tengo cuenta'}
      </button>
    </form></div>
  );
}
