import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../lib/routes';
import { Brand } from './Brand';

export function Sidebar() {
  const { user } = useAuth();
  return (
    <aside className="sidebar">
      <Brand />
      <nav className="nav" aria-label="Principal">
        {ROUTES.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} end={path === '/'} className="nav__link" title={label}>
            {({ isActive }) => (
              <>
                {isActive && <motion.span layoutId="nav-pill" className="nav__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <Icon size={19} /><span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="usercard">
        <span className="avatar">{user?.name.charAt(0).toUpperCase()}</span>
        <div><b>{user?.name}</b><small>{user?.email}</small></div>
      </div>
    </aside>
  );
}
