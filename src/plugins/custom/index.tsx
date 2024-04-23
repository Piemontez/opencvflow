import { PluginType } from '../../core/types/plugin';
import { MenuActionProps } from '../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef } from 'react';
import EditComponenteModal from './EditComponenteModal';
import { useCustomComponentStore } from '../../ide/contexts/CustomComponentStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { Button } from 'react-bootstrap';
import { useShallow } from 'zustand/react/shallow';

export const tabName = ['Custom Components'];

const editCompRef = createRef<EditComponenteModal>();

const ListComponents = () => {
  const customComponents = useCustomComponentStore(useShallow((state) => state.customComponents));

  return (
    <>
      {customComponents.map((custom, idx) => (
        <Button
          key={idx}
          size="sm"
          variant="transparent"
          onDragStart={(event: any) => useNodeStore.getState().onDragStartCustom(event, custom)}
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
  headerExtraElement: <EditComponenteModal key="custom" ref={editCompRef} />,
};

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction],
};

export default OpenCVPlugin;
