import jsonToNodeStore from '../core/utils/jsonToNodeStore';
import { Row } from 'react-bootstrap';
import { useEffect } from 'react';
import { usePluginStore } from '../core/contexts/PluginStore';
import Storage from './commons/Storage';
import { STORAGE_NODESTORE_ID } from './commons/consts';
import { useDarkModeStore } from './contexts/DarkModeStore';
import MenuBar from './components/MenuBar';
import PropertyBar from './components/PropertyBar';
import StatusBar from './components/StatusBar';
import Flow from './components/Flow';
import NotificationList from './components/Notification';
import DockActionsBar from './components/ActionsBar';
import NewModal from './components/NewModal';
import { useNewModalStore } from './contexts/NewModalStore';
import { loadFromJson } from '../core/utils/loadFromJson';

const IDE = () => {
  const darkStore = useDarkModeStore((state) => state);
  const pluginStore = usePluginStore((state) => state);

  useEffect(() => {
    // Carrega o modo de cores
    darkStore.loadFromCache();

    // Carrega os plugins
    pluginStore
      .init()
      .then(() => {
        const json = Storage.get(STORAGE_NODESTORE_ID, 'this');
        const jsonLoaded = jsonToNodeStore(json);
        const hasProject = loadFromJson(jsonLoaded);

        // Se não existe em cache abre modal de novo projeto.
        if (!hasProject) {
          useNewModalStore.getState().show();
        }
      })
      .catch(console.error);
  }, []);

  return (
    <Row id="ide" className="d-flex flex-fill flex-column flex-nowrap align-items-stretch">
      <NewModal />
      <NotificationList />
      <MenuBar />
      <div id="dockwidgets" className="flex-fill d-flex">
        <DockActionsBar />
        <div className="flex-grow-1">
          <Flow />
        </div>
        <PropertyBar />
      </div>
      <StatusBar />
    </Row>
  );
};

export default IDE;
