import { render } from 'react-dom';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import "renderer/assets/css/main.css";
import PluginStore from './contexts/PluginStore';

PluginStore.init();

render(<App />, document.getElementById('root'));
