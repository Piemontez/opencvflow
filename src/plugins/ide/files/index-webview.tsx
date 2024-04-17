import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FileNewAction from './FileNewAction';
import { useNotificationStore } from '../../../ide/components/Notification/store';

const FileSaveAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'save'} /> Save
    </>
  ),
  action: () => {
    useNotificationStore.getState().warn('Only implemented in desktop version');
  },
};

const FileOpenAction: MenuActionProps = {
  tabTitle: 'File',
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

export { FileNewAction, FileSaveAction, FileOpenAction };
