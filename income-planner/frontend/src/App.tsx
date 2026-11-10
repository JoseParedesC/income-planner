import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { useAuth } from './context/AuthContext';
import { useMeta } from './context/MetaContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import DataPage from './pages/DataPage';
import Dates from './pages/Dates';
import Documents from './pages/Documents';
import Learn from './pages/Learn';
import Simulator from './pages/Simulator';

export default function App() {
  const { user, loading } = useAuth();
  const { ready } = useMeta();
  if (loading || !ready) return <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}><span className="skel" style={{ width: 56, height: 56, borderRadius: 18 }} /></div>;
  if (!user) return <AuthPage />;
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Dashboard />} />
        <Route path="datos" element={<DataPage />} />
        <Route path="simulador" element={<Simulator />} />
        <Route path="documentos" element={<Documents />} />
        <Route path="fechas" element={<Dates />} />
        <Route path="aprende" element={<Learn />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
