import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../shared/ui/Header';
import { PageFallback } from '../shared/ui/PageFallback';

export function RootBoundary() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Outlet />
    </Suspense>
  );
}

export function Layout() {
  return (
    <>
      <Header />
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </>
  );
}