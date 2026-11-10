import { motion } from 'framer-motion';
import { useMeta } from '../../context/MetaContext';
import { usePlan } from '../../context/PlanContext';
import { fadeUp } from '../../lib/motion';
import { Checkbox } from '../ui';

export function DocumentList() {
  const { meta } = useMeta();
  const { done, toggleDoc } = usePlan();
  return (
    <motion.div className="stack" style={{ gap: 10 }} initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}>
      {meta.docs.map((d) => {
        const on = done.has(d.key);
        return (
          <motion.button key={d.key} variants={fadeUp} whileTap={{ scale: 0.985 }} className={`doc${on ? ' doc--done' : ''}`} onClick={() => toggleDoc(d.key)} role="checkbox" aria-checked={on}>
            <Checkbox checked={on} /><span className="doc__label">{d.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
