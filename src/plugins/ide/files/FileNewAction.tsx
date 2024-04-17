import { useNodeStore } from '../../../ide/contexts/NodeStore';
import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileNewAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'new',
  title: (
    <>
      <FontAwesomeIcon className="text-info" icon={'file'} /> new
    </>
  ),
  action: () => {
    useNodeStore.getState().clear();
  },
};

export default FileNewAction;
