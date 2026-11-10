import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <Button variant="icon" onClick={toggle} aria-label={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={theme} initial={{ rotate: -80, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 80, opacity: 0, scale: 0.6 }} transition={{ duration: 0.18 }} style={{ display: 'grid' }}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </motion.span>
      </AnimatePresence>
    </Button>
  );
}
