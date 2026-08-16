import { useEffect, useState } from 'react';

type ApiState = 'checking' | 'ready' | 'unavailable';

export function App() {
  const [apiState, setApiState] = useState<ApiState>('checking');

  useEffect(() => {
    const controller = new AbortController();
    void fetch('/health/ready', { signal: controller.signal })
      .then((response) => setApiState(response.ok ? 'ready' : 'unavailable'))
      .catch(() => setApiState('unavailable'));
    return () => controller.abort();
  }, []);

  return (
    <main className="shell">
      <section className="panel">
        <span className="eyebrow">APPLICATION ADMIN</span>
        <h1>管理后台底座已就绪</h1>
        <p>当前仅包含空白运行架构。身份、权限和业务模块将在后续阶段按垂直切片迁移。</p>
        <div className={`status status--${apiState}`}>
          <span className="status__dot" aria-hidden="true" />
          API {apiState === 'checking' ? '检查中' : apiState === 'ready' ? '已就绪' : '不可用'}
        </div>
      </section>
    </main>
  );
}
