import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { PluginType } from 'renderer/types/plugin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FileExitAction: MenuActionProps = {
  tabTitle: 'File',
  title: 'Exit',
  action: () => {
    alert(1);
  },
};

const RunAction: MenuActionProps = {
  tabTitle: 'Build',
  name: 'run',
  title: <FontAwesomeIcon className="text-success" icon={'play-circle'} />,
  action: () => {
    NodeStore.run();
  },
};

const StopAction: MenuActionProps = {
  tabTitle: 'Build',
  name: 'stop',
  title: <FontAwesomeIcon className="text-danger" icon={'stop-circle'} />,
  action: () => {
    NodeStore.stop();
  },
};

const OpenCVPlugin: PluginType = {
  name: 'OpenCV Plugin',
  components: [FileExitAction, RunAction, StopAction],
};

export default OpenCVPlugin;
