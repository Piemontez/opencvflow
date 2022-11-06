import { PluginType } from 'renderer/types/plugin';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { EditComponenteModal } from './EditComponenteModal';

export const tabName = 'Custom Components';

const editCompRef = React.createRef<EditComponenteModal>();
const ECM6Fix = () => <EditComponenteModal ref={editCompRef} />;

const NewComponentAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'new',
  title: (
    <span onClick={() => editCompRef.current?.handleShow()}>
      <FontAwesomeIcon className="text-info" icon={'plus'} /> new
    </span>
  ),
  headerExtraElement: <ECM6Fix />,
};

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction],
};

export default OpenCVPlugin;
