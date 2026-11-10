import { PlanProvider } from '../../context/PlanContext';
import { PageTransition } from './PageTransition';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AppShell() {
  return (
    <PlanProvider>
      <div className="app">
        <Sidebar />
        <div className="shell">
          <Topbar />
          <main className="page"><PageTransition /></main>
          <footer className="footer">Herramienta orientativa con fines académicos. No reemplaza la asesoría de un contador público ni la información oficial de la DIAN. Verifica UVT, topes y fechas en dian.gov.co.</footer>
        </div>
      </div>
    </PlanProvider>
  );
}
