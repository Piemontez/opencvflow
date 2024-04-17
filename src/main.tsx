import { StrictMode, lazy } from 'react';
import ReactDOM from 'react-dom/client'

// React Flow
import 'reactflow/dist/style.css';
// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// OpenCV-Flow
//import 'ide/assets/css/main.css';
import './ide/assets/fontawasome.library';

const App = lazy(() => import('./ide'));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
