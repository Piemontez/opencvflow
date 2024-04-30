import { MenuActionProps } from '../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { createRef } from 'react';
import EditComponenteModal from './EditComponenteModal';
import { useCustomComponentStore } from '../../ide/contexts/CustomComponentStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { Button } from 'react-bootstrap';
import { useShallow } from 'zustand/react/shallow';
import { customTabName } from './tabname';

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

export const NewComponentAction: MenuActionProps = {
  tabTitle: customTabName,
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
