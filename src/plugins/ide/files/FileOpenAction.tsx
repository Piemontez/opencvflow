import { MenuActionProps } from '../../../ide/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNotificationStore } from '../../../ide/components/Notification/store';

const FileOpenAction: MenuActionProps = {
  tabTitle: ['File'],
  name: 'open',
  title: (
    <>
      <FontAwesomeIcon className="text-warning" icon={'folder-open'} /> Open file
    </>
  ),
  action: () => {
    useNotificationStore
      .getState()
      .warn('Only implemented in desktop version. If you want to open an image/video file, access the Inputs -> File Loader menu.');
  },
};

export default FileOpenAction;
