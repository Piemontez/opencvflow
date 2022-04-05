import { Row } from 'react-bootstrap';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import PluginStore from './contexts/PluginStore';
import { lazy } from 'react';

const NotificationProvider = lazy(() => import('./components/Notification'));
const Header = lazy(() => import('./components/Header'));
const Flow = lazy(() => import('./components/Flow'));
const PropertyBar = lazy(() => import('./components/PropertyBar'));
const Footer = lazy(() => import('./components/Footer'));

PluginStore.init();

const AppContent = () => {
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
};

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={AppContent} />
      </Switch>
    </Router>
  );
}
