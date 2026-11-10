import { EDU } from '@pr/shared';

export default function Learn() {
  return (
    <div className="card"><h2>📚 Cultura tributaria en breve</h2>
      {EDU.map((e) => <details key={e.title}><summary>{e.title}</summary><p>{e.text}</p></details>)}
    </div>);
}
