import { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'renderer/assets/css/main.css';
import 'renderer/assets/fontawasome.library';

const App = lazy(() => import('./App'));

render(
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>,

  document.getElementById('root')
);
