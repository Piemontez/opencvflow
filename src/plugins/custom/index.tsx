import { PluginType } from 'renderer/types/plugin';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { EditComponenteModal } from './EditComponenteModal';
import { CustomComponentContext } from 'renderer/contexts/CustomComponentStore';
import { observer } from 'mobx-react';

export const tabName = 'Custom Components';

const ListComponents = observer(() => {
  const customComponentStore = useContext(CustomComponentContext);

  return (
    <>
      {customComponentStore.customcomponents.map((custom) => (
        <>
          {' '}
          <span onClick={() => alert(1)}>{custom.name}</span>
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
