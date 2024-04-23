import { useNewModalStore } from '../../../ide/contexts/NewModalStore';
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
    useNewModalStore.getState().show();
  },
};

export default FileNewAction;
