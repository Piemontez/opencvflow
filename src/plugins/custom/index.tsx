import { PluginType } from 'renderer/types/plugin';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { EditComponenteModal } from './EditComponenteModal';
import { CustomComponentContext } from 'renderer/contexts/CustomComponentStore';
import { observer } from 'mobx-react';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';

export const tabName = 'Custom Components';

const ListComponents = observer(() => {
  const customComponentStore = useContext(CustomComponentContext);
  const nodeStore = useContext(NodeStoreContext);

  return (
    <>
      {customComponentStore.customComponents.map((custom) => (
        <>
          {' '}
          <span
            onDragStart={(event: any) => nodeStore.onDragStartCustom(event, custom)}
            draggable
          >
            {custom.name}
          </span>
        </>
      ))}
    </>
  );
});

const editCompRef = React.createRef<EditComponenteModal>();
const EditComponenteModalEl = () => <EditComponenteModal ref={editCompRef} />;

const NewComponentAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'new',
  title: (
    <>
      <span onClick={() => editCompRef.current?.handleShow()}>
        <FontAwesomeIcon className="text-info" icon={'plus'} /> new
      </span>

      <ListComponents />
    </>
  ),
  headerExtraElement: <EditComponenteModalEl />,
};

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction],
};

export default OpenCVPlugin;
