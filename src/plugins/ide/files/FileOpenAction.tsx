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
      const { elements } = JSON.parse(fileDdata);

      // Adiciona os componentes
      const components = (elements as Array<any>)
        .filter((el) => !((el as OCVFEdge).source && (el as OCVFEdge).target))
        .map(({ data, ...rest }) => {
          const element = rest as CVFNode | OCVFEdge;
          if (element.type) {
            const component = NodeStore.getNodeType(element.type);
            if (component) {
              element.data = new component.processor();
              Object.keys(element.data.propertiesMap).forEach((key) => {
                if (data[key]) {
                  Object.assign((element.data as any)[key], data[key]);
                }
              });
            }
          }
          return element;
        });
      NodeStore.elements = components;

      // Adiciona as conecções
      (elements as Array<any>)
        .filter((el) => (el as OCVFEdge).source && (el as OCVFEdge).target)
        .forEach(({ data, ...rest }) => {
          NodeStore.onConnect(rest as OCVFEdge);
        });
    }
  },
};

export default FileOpenAction;
