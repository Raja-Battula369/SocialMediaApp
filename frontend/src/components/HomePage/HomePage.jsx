import React, { Suspense, lazy } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { fallbackRender } from '../Error/ErrorFallback.jsx';
import Loading from '../loader/Loading.jsx';

const Home = lazy(() => import('./Home'));

const HomePage = () => {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <ErrorBoundary fallbackRender={fallbackRender}>
          <Home />
        </ErrorBoundary>
      </Suspense>
    </>
  );
};

export default HomePage;
