import { Row } from 'react-bootstrap';
import { lazy, useEffect } from 'react';
import { usePluginStore } from './contexts/PluginStore';
import { useNodeStore } from '../core/contexts/NodeStore';

const NotificationProvider = lazy(() => import('./components/Notification'));
const Header = lazy(() => import('./components/Header'));
const Flow = lazy(() => import('./components/Flow'));
const PropertyBar = lazy(() => import('./components/PropertyBar'));
const Footer = lazy(() => import('./components/Footer'));

const IDE = () => {
  const pluginStore = usePluginStore((state) => state);
  const nodeStore = useNodeStore((state) => state);
  useEffect(() => {
    pluginStore.init().then(() => {
      nodeStore.init();
    });
  }, []);

  return (
    <Row id="ide" className="d-flex flex-fill flex-column flex-nowrap align-items-stretch">
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

export default IDE;
