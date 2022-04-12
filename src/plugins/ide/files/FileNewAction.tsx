import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileNewction: MenuActionProps = {
  tabTitle: 'File',
  name: 'new',
  title: (
    <>
      <FontAwesomeIcon className="text-info" icon={'file'} /> new
    </>
  ),
  action: () => {
    NodeStore.elements = [];
  },
};

export default FileNewction;
