import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { notify } from 'renderer/components/Notification';

const FileSaveAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'save'} /> Save
    </>
  ),
  action: () => {
    notify.warn('Only implemented in desktop version');
  },
};

const FileOpenAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'open',
  title: (
    <>
      <FontAwesomeIcon className="text-warning" icon={'folder-open'} /> Open
      file
    </>
  ),
  action: () => {
    notify.warn(
      'Only implemented in desktop version. If you want to open an image file, access the Inputs -> File Loader menu.'
    );
  },
};

export { FileSaveAction, FileOpenAction };
