import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import path from 'path';
import { app, dialog, getCurrentWindow } from '@electron/remote';
import { OpenDialogOptions } from 'electron';
import * as fs from 'fs';
import { CVFNode } from 'renderer/types/node';
import { OCVFEdge } from 'renderer/types/edge';

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
      json.elements = (json.elements as Array<any>).map(({ data, ...rest }) => {
        const element = rest as CVFNode | OCVFEdge;
        console.log(data);
        console.log(element);
        if (element.type) {
          const component = NodeStore.getNodeType(element.type);
          if (component) {
            element.data = new component.processor();
            Object.assign(element.data, data);
          }
        }
        return element;
      });
      NodeStore.elements = json.elements;
    }
  },
};

export default FileOpenAction;
