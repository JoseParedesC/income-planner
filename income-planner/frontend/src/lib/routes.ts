import { Calculator, CalendarClock, FolderCheck, GraduationCap, LayoutDashboard, WalletCards, type LucideIcon } from 'lucide-react';

export interface AppRoute { path: string; label: string; icon: LucideIcon; title: string; subtitle: string }
export const ROUTES: AppRoute[] = [
  { path: '/', label: 'Panorama', icon: LayoutDashboard, title: 'Panorama', subtitle: 'Resumen de tu situación tributaria' },
  { path: '/datos', label: 'Mis datos', icon: WalletCards, title: 'Mis datos', subtitle: 'Ingresos, deducciones y patrimonio del año' },
  { path: '/simulador', label: 'Simulador', icon: Calculator, title: 'Simulador de renta', subtitle: 'Tu impuesto estimado, paso a paso' },
  { path: '/documentos', label: 'Documentos', icon: FolderCheck, title: 'Documentos', subtitle: 'Reúne los soportes de tu declaración' },
  { path: '/fechas', label: 'Fechas', icon: CalendarClock, title: 'Fechas clave', subtitle: 'Hitos del año y tu fecha de declaración' },
  { path: '/aprende', label: 'Aprende', icon: GraduationCap, title: 'Cultura tributaria', subtitle: 'Conceptos básicos explicados simple' },
];
