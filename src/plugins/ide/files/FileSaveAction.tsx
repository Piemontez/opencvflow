import { useNotificationStore } from '../../../ide/components/Notification/store';
import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileSaveAction: MenuActionProps = {
  tabTitle: ['File'],
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon icon={'save'} /> Save
    </>
  ),
  action: () => {
    useNotificationStore.getState().warn('Only implemented in desktop version');
  },
};

export default FileSaveAction;
