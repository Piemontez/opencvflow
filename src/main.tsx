import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import IDE from './ide';

// OpenCV-Flow Style, Bootstrap and React Flow
import './ide/assets/scss/main.scss';
// Font Awasome
import './ide/assets/fontawasome.library';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IDE />
  </StrictMode>,
);
