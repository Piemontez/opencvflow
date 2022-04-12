import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { app, dialog, getCurrentWindow } from '@electron/remote';
import { OpenDialogOptions } from 'electron';
import * as fs from 'fs';
import jsonToNodeStore from 'renderer/utils/jsonToNodeStore';

const options: OpenDialogOptions = {
  title: 'Save file - OpenCV Flow',
  defaultPath: app.getPath('documents'),
  properties: ['openFile'],
  filters: [
    { name: 'OpenCV-Flow', extensions: ['cvflow'] },
    { name: 'All Files', extensions: ['*'] },
  ],
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
  action: async () => {
    const rs = await dialog.showOpenDialog(
      getCurrentWindow(),
      options as OpenDialogOptions
    );
    if (!rs.canceled && rs.filePaths.length) {
      const fileDdata = fs.readFileSync(rs.filePaths[0], {
        encoding: 'utf-8',
        flag: 'r',
      });
      const json = JSON.parse(fileDdata);
      jsonToNodeStore(json);
    }
  },
};

export default FileOpenAction;
