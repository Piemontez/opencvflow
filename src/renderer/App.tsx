import { Row } from 'react-bootstrap';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Flow from './components/Flow';
import Footer from './components/Footer';
import PropertyBar from './components/PropertyBar';
import Header from './components/Header';
import PluginStore from './contexts/PluginStore';
import NotificationProvider from './components/Notification';

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
