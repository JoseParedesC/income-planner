import { NavLink, Navigate, Route, Routes } from 'react-router-dom';
import { YEARS } from '@pr/shared';
import { useAuth } from './auth';
import { PlanProvider, usePlan } from './plan';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DataPage from './pages/DataPage';
import Simulator from './pages/Simulator';
import Checklist from './pages/Checklist';
import Dates from './pages/Dates';
import Learn from './pages/Learn';

const TABS = [['/', '🏠 Panorama'], ['/datos', '📒 Mis datos'], ['/simulador', '🧮 Simulador'], ['/documentos', '📂 Documentos'], ['/fechas', '⏰ Fechas'], ['/aprende', '📚 Aprende']] as const;

function Shell() {
  const { user, logout } = useAuth();
  const { year, setYear, save } = usePlan();
  return (
    <>
      <header><div className="w top">
        <div><h1>🧾 PlanificaRenta</h1><p className="sub">Hola, {user!.name.split(' ')[0]} 👋 · {save === 'saving' ? 'Guardando…' : save === 'saved' ? 'Guardado ✓' : save === 'error' ? 'Error al guardar' : 'Tus datos se guardan solos'}</p></div>
        <div className="actions">
          <select value={year} onChange={(e) => setYear(+e.target.value)} aria-label="Año gravable">{YEARS.map((y) => <option key={y}>{y}</option>)}</select>
          <button className="ghost" onClick={logout}>Salir</button>
        </div>
      </div></header>
      <nav>{TABS.map(([to, t]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'on' : '')}>{t}</NavLink>)}</nav>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} /><Route path="/datos" element={<DataPage />} />
          <Route path="/simulador" element={<Simulator />} /><Route path="/documentos" element={<Checklist />} />
          <Route path="/fechas" element={<Dates />} /><Route path="/aprende" element={<Learn />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <footer>Prototipo académico con fines orientativos. No reemplaza la asesoría de un contador público, la información oficial de la DIAN ni la normativa vigente. Verifica UVT, topes y fechas en dian.gov.co.</footer>
    </>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <p className="center">Cargando…</p>;
  if (!user) return <AuthPage />;
  return <PlanProvider><Shell /></PlanProvider>;
}
