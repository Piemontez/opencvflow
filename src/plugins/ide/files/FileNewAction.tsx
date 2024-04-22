import { useNodeStore } from '../../../core/contexts/NodeStore';
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
    useNodeStore.getState().clear();
  },
};

export default FileNewAction;
