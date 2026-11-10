import { EASE } from './constants';
export const ease = [...EASE] as [number, number, number, number];
export const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } } };
