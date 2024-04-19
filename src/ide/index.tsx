import jsonToNodeStore from '../core/utils/jsonToNodeStore';
import CustomComponentStore from '../ide/contexts/CustomComponentStore';
import { Row } from 'react-bootstrap';
import { useEffect } from 'react';
import { usePluginStore } from './contexts/PluginStore';
import { useNodeStore } from '../core/contexts/NodeStore';
import Storage from './commons/Storage';
import { useNotificationStore } from './components/Notification/store';
import { STORAGE_NODESTORE_ID } from './commons/consts';
import { useDarkModeStore } from './contexts/DarkModeStore';
import MenuBar from './components/MenuBar';
import PropertyBar from './components/PropertyBar';
import StatusBar from './components/StatusBar';
import Flow from './components/Flow';
import NotificationList from './components/Notification';
import ActionsBar from './components/ActionsBar';

const IDE = () => {
  const darkStore = useDarkModeStore((state) => state);
  const pluginStore = usePluginStore((state) => state);

  useEffect(() => {
    // Carrega o modo de cores
    darkStore.loadFromCache();

    // Carrega os plugins
    pluginStore
      .init()
      .then(loadFromCache)
      .catch(() => {});
  }, []);

  return (
    <Row id="ide" className="d-flex flex-fill flex-column flex-nowrap align-items-stretch">
      <NotificationList />
      <MenuBar />
      <div id="dockwidgets" className="flex-fill d-flex">
        <ActionsBar />
        <div className="flex-grow-1">
          <Flow />
        </div>
        <PropertyBar />
      </div>
      <StatusBar />
    </Row>
  );
};

/**
 * Carrega o último save
 */
const loadFromCache = () => {
  // Aguarda renderizar a tela e carrega a última edição em cache
  try {
    const json = Storage.get(STORAGE_NODESTORE_ID, 'this');
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
      useNodeStore.getState().onConnect(rest as any);
    });

    useNodeStore.getState().refreshFlow();

    setTimeout(useNodeStore.getState().fitView, 500);
  } catch (err: any) {
    console.error(err);
    useNotificationStore.getState().danger(err.message);
  }
};

export default IDE;
