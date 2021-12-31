import { Row } from 'react-bootstrap';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import Body from './components/Body';
import Footer from './components/Footer';
import Header from './components/Header';

const AppContent = () => {
  return (
    <Row className="d-flex flex-fill flex-column align-items-stretch">
      <Header />
      <Body />
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
