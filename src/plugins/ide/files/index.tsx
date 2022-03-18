import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import path from 'path';
import { toJS } from 'mobx';
import { OCVFEdge } from 'renderer/types/edge';
import { CVFNode, CVFNodeProcessor } from 'renderer/types/node';
import * as electron from 'electron';

const options = {
  title: 'Save file - OpenCV Flow',
  defaultPath: path.resolve(__dirname),
  filters: [
    { name: 'OpenCV-Flow', extensions: ['cvflow'] },
    { name: 'All Files', extensions: ['*'] },
  ],
};

const FileOpenAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'save',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'save'} /> Save
    </>
  ),
  action: () => {
    const elements: Array<CVFNode | OCVFEdge> = toJS(NodeStore.elements);
    const elementsUsefulData = elements.map(({ data, ...rest }) => ({
      data: (data as CVFNodeProcessor)?.propertiesMap,
      ...rest,
    }));
    const ID = parseInt(process.env.MAIN_WINDOW_ID!, 10);
    console.log(elements);
    console.log(elementsUsefulData);
    console.log(path.resolve(__dirname));
    console.log(process.env.MAIN_WINDOW_ID);
    console.log(ID);
    console.log(electron);
    console.log(electron.BrowserWindow);
    console.log(electron.BrowserWindow.getAllWindows());
    console.log(electron.BrowserWindow.fromId(ID));
    electron.dialog.showSaveDialog(electron.BrowserWindow.fromId(ID)!, options);
    return null;
  },
};

const FileSaveAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'open',
  title: (
    <>
      <FontAwesomeIcon className="text-warning" icon={'folder-open'} /> Open
      file
    </>
  ),
  action: () => {
    return null;
  },
};

const FileExitAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'exit',
  title: (
    <>
      <FontAwesomeIcon className="text-danger" icon={'door-open'} /> Exit
    </>
  ),
  action: () => {
    return null;
  },
};

export { FileOpenAction, FileSaveAction, FileExitAction };
