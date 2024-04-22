import { StrictMode, lazy } from 'react';
import ReactDOM from 'react-dom/client';

// OpenCV-Flow Style, Bootstrap and React Flow
import './ide/assets/scss/main.scss';
// Font Awasome
import './ide/assets/fontawasome.library';

const IDE = lazy(() => import('./ide'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IDE />
  </StrictMode>,
);
