import { lazy, Suspense } from 'react';
import { render } from 'react-dom';

// React Flow
import 'react-flow-renderer/dist/style.css';
import 'react-flow-renderer/dist/theme-default.css';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// OpenCV-Flow
import 'renderer/assets/css/main.css';
import 'renderer/assets/fontawasome.library';

const App = lazy(() => import('./App'));

render(
  <Suspense fallback={<div>Loading...</div>}>
    <App />
  </Suspense>,

  document.getElementById('root')
);
