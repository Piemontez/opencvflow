import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getCurrentWindow } from '@electron/remote';
import FileSaveAction from './FileSaveAction';
import FileOpenAction from './FileOpenAction';
import FileNewAction from './FileNewAction';

const FileExitAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'exit',
  title: (
    <>
      <FontAwesomeIcon className="text-danger" icon={'door-open'} /> Exit
    </>
  ),
  action: () => {
    getCurrentWindow().close();
  },
};

export { FileNewAction, FileSaveAction, FileOpenAction, FileExitAction };
