import { Row } from 'react-bootstrap';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { Component, lazy } from 'react';
import PluginStore from './contexts/PluginStore';
import NodeStore from 'renderer/contexts/NodeStore';

const NotificationProvider = lazy(() => import('./components/Notification'));
const Header = lazy(() => import('./components/Header'));
const Flow = lazy(() => import('./components/Flow'));
const PropertyBar = lazy(() => import('./components/PropertyBar'));
const Footer = lazy(() => import('./components/Footer'));

class AppContent extends Component {
  componentDidMount() {
    PluginStore.init().then(() => {
      NodeStore.init();
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <Row className="d-flex flex-fill flex-column flex-nowrap align-items-stretch">
        <NotificationProvider />
        <Header />
        <div className="flex-fill d-flex">
          <div className="flex-grow-1">
            <Flow />
          </div>
          <PropertyBar />
        </div>
        <Footer />
      </Row>
    );
  }
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppContent} />
      </Switch>
    </Router>
  );
}
