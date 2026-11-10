import { motion } from 'framer-motion';
import { useMeta } from '../../context/MetaContext';
import { fadeUp } from '../../lib/motion';
import { Badge } from '../ui';

export function MilestoneTimeline() {
  const { meta } = useMeta();
  const month = new Date().getMonth();
  return (
    <motion.div className="tl" initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.07 } } }}>
      {meta.milestones.map((h) => (
        <motion.div key={h.short} variants={fadeUp} className={`tl__item${h.month === month ? ' tl__item--now' : h.month < month ? ' tl__item--past' : ''}`}>
          <span className="tl__dot">{h.short}</span>
          <div><b>{h.title}</b> {h.month === month && <Badge tone="warn">Este mes</Badge>}<p>{h.text}</p></div>
        </motion.div>
      ))}
    </motion.div>
  );
}
