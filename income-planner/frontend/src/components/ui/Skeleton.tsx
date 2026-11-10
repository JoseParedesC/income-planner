export function Skeleton({ h = 20, w = '100%', r }: { h?: number; w?: number | string; r?: number }) {
  return <div className="skel" style={{ height: h, width: w, borderRadius: r }} aria-hidden />;
}
