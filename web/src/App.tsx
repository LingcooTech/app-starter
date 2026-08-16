export function App() {
  return (
    <main className="landing">
      <div className="glow glow--one" />
      <div className="glow glow--two" />
      <section className="hero">
        <span className="badge">MODERN TYPESCRIPT APPLICATION</span>
        <h1>业务从这里开始，框架到这里为止。</h1>
        <p>
          NestJS、Fastify、PostgreSQL、Drizzle 与 React 已完成最小组合。当前页面不承载任何行业模型。
        </p>
        <div className="stack" aria-label="Technology stack">
          {['NestJS', 'Fastify', 'Drizzle', 'React', 'Docker'].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>
    </main>
  );
}
