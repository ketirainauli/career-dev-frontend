import './PageFallback.css';

export function PageFallback() {
  return (
    <main className="page-fallback" aria-busy="true" aria-label="იტვირთება">
      <div className="page-fallback__block page-fallback__block--title" />
      <div className="page-fallback__block" />
      <div className="page-fallback__block" />
    </main>
  );
}