import jsonToNodeStore from '../core/utils/jsonToNodeStore';
import CustomComponentStore from '../ide/contexts/CustomComponentStore';
import { Row } from 'react-bootstrap';
import { lazy, useEffect } from 'react';
import { usePluginStore } from './contexts/PluginStore';
import { useNodeStore } from '../core/contexts/NodeStore';
import Storage from './commons/Storage';
import { useNotificationStore } from './components/Notification/store';

const NotificationProvider = lazy(() => import('./components/Notification'));
const Header = lazy(() => import('./components/Header'));
const Flow = lazy(() => import('./components/Flow'));
const PropertyBar = lazy(() => import('./components/PropertyBar'));
const Footer = lazy(() => import('./components/Footer'));

const IDE = () => {
  const pluginStore = usePluginStore((state) => state);

  useEffect(() => {
    pluginStore
      .init()
      .then(loadFromCache)
      .catch(() => {});
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

const loadFromCache = () => {
  // Aguarda renderizar a tela e carrega a última edição em cache
  setTimeout(() => {
    try {
      const json = Storage.get('NodeStore', 'this');
      const jsonLoaded = jsonToNodeStore(json);

      // Carrega os tipo de nó customizados
      if (jsonLoaded.custom?.components) {
        for (const customComponent of jsonLoaded.custom.components) {
          CustomComponentStore.add(customComponent);
        }
      }

      // Adiciona os nós
      useNodeStore.getState().refreshNodes(jsonLoaded.nodesLoaded);

      // Adiciona as conecções
      jsonLoaded.edgesLoaded.forEach(({ data, ...rest }) => {
        useNodeStore.getState().onConnect(rest as OCVFEdge);
      });

      useNodeStore.getState().fitView();
      useNodeStore.getState().refreshFlow();
    } catch (err: any) {
      console.error(err);
      useNotificationStore.getState().danger(err.message);
    }
  }, 500);
};

export default IDE;
