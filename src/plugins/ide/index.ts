import { MenuAction } from 'renderer/types/menu';
import { PluginType } from 'renderer/types/plugin';

const FileExitAction: MenuAction = {
  tabTitle: 'File',
  title: 'Exit',
  action: () => {
      alert(1);
  },
};

const OpenCVPlugin: PluginType = {
  name: 'OpenCV Plugin',
  components: [FileExitAction],
};

export default OpenCVPlugin;
