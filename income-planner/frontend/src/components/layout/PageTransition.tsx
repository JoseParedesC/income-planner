import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { ease } from '../../lib/motion';

/** Transición de entrada/salida entre páginas (la salida usa el outlet congelado). */
export function PageTransition() {
  const { pathname } = useLocation();
  const outlet = useOutlet();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [pathname]);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={pathname} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.26, ease }}>
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
