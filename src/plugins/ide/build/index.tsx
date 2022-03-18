import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const RunAction: MenuActionProps = {
  tabTitle: 'Build',
  name: 'run',
  title: (
    <>
      <FontAwesomeIcon className="text-success" icon={'play-circle'} /> Run
    </>
  ),
  action: () => {
    NodeStore.run();
  },
};

const StopAction: MenuActionProps = {
  tabTitle: 'Build',
  name: 'stop',
  title: (
    <>
      <FontAwesomeIcon className="text-danger" icon={'stop-circle'} /> Stop
    </>
  ),
  action: () => {
    NodeStore.stop();
  },
};

export { RunAction, StopAction };
