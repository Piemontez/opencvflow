import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useCustomComponentStore } from '../../../ide/contexts/CustomComponentStore';
import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileNewAction: MenuActionProps = {
  tabTitle: ['File'],
  name: 'new',
  title: (
    <>
      <FontAwesomeIcon icon={'file'} /> New
    </>
  ),
  action: () => {
    useCustomComponentStore.getState().clear();
    useNodeStore.getState().clear();
    useNodeStore.getState().storage();
  },
};

export default FileNewAction;
