import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import path from 'path';
import { toJS } from 'mobx';
import { OCVFEdge } from 'renderer/types/edge';
import { CVFNode, CVFNodeProcessor } from 'renderer/types/node';
import { app, dialog, getCurrentWindow } from '@electron/remote';
import { SaveDialogOptions } from 'electron';
import * as fs from 'fs';

const options: SaveDialogOptions = {
  title: 'Save file - OpenCV Flow',
  defaultPath: app.getPath('documents'),
  filters: [
    { name: 'OpenCV-Flow', extensions: ['cvflow'] },
    { name: 'All Files', extensions: ['*'] },
  ],
};

const FileSaveAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'save'} /> Save
    </>
  ),
  action: async () => {
    const elements: Array<CVFNode | OCVFEdge> = toJS(NodeStore.elements);
    const elementsUsefulData = elements.map(({ data, ...rest }) => ({
      data: (data as CVFNodeProcessor)?.propertiesMap,
      ...rest,
    }));
    const rs = await dialog.showSaveDialog(
      getCurrentWindow(),
      options as SaveDialogOptions
    );
    if (!rs.canceled && rs.filePath) {
      const filePath =
        rs.filePath.indexOf('.') > 0 ? rs.filePath : `${rs.filePath}.cvflow`;

      fs.writeFileSync(
        filePath,
        JSON.stringify({ elements: elementsUsefulData }),
        {
          encoding: 'utf-8',
          flag: 'w',
        }
      );
    }
    return null;
  },
};

export default FileSaveAction;
