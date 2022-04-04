import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileSaveAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'save'} /> Save
    </>
  ),
  action: () => {
    alert('Only implemented in desktop version');
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
    alert('Only implemented in desktop version');
  },
};

export { FileSaveAction, FileOpenAction };
