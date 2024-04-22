import { PluginType } from '../../ide/types/plugin';
import { MenuActionProps } from '../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef, useContext } from 'react';
import EditComponenteModal from './EditComponenteModal';
import { CustomComponentContext } from '../../ide/contexts/CustomComponentStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { Button } from 'react-bootstrap';

export const tabName = ['Custom Components'];

const editCompRef = createRef<EditComponenteModal>();
const EditComponenteModalEl = () => <EditComponenteModal ref={editCompRef} />;

const ListComponents = () => {
  const customComponentStore = useContext(CustomComponentContext);
  const nodeStore = useNodeStore();

  return (
    <>
      {customComponentStore.customComponents.map((custom, idx) => (
        <Button
          key={idx}
          size="sm"
          variant="transparent"
          onDragStart={(event: any) => nodeStore.onDragStartCustom(event, custom)}
          onClick={() => editCompRef.current?.handleEdit(custom)}
          draggable
        >
          {custom.title}
        </Button>
      ))}
    </>
  );
};

const NewComponentAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'new',
  title: (
    <>
      <span onClick={() => editCompRef.current?.handleNew()}>
        <FontAwesomeIcon icon={'plus'} /> Create Custom
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
