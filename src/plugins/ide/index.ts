import NodeStore from 'renderer/contexts/NodeStore';
import { MenuAction } from 'renderer/types/menu';
import { PluginType } from 'renderer/types/plugin';

const FileExitAction: MenuAction = {
  tabTitle: 'File',
  title: 'Exit',
  action: () => {
    alert(1);
  },
};

const RunAction: MenuAction = {
  tabTitle: 'Build',
  title: 'Run',
  action: () => {
    NodeStore.run();
  },
};

const StopAction: MenuAction = {
  tabTitle: 'Build',
  title: 'Stop',
  action: () => {
    NodeStore.stop();
  },
};

const OpenCVPlugin: PluginType = {
  name: 'OpenCV Plugin',
  components: [FileExitAction, RunAction, StopAction],
};

export default OpenCVPlugin;
