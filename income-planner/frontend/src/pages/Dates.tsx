import { CalendarDays } from 'lucide-react';
import { DeadlineCard, MilestoneTimeline } from '../components/domain';
import { Card, CardHeader, Stagger, StaggerItem } from '../components/ui';

export default function Dates() {
  return (
    <Stagger className="stack">
      <StaggerItem><DeadlineCard /></StaggerItem>
      <StaggerItem><Card><CardHeader icon={CalendarDays} title="Hitos del año" description="Una guía para no dejar todo para última hora" /><MilestoneTimeline /></Card></StaggerItem>
    </Stagger>
  );
}
