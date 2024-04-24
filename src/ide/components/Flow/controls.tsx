import { ControlButton, Controls } from 'reactflow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { memo } from 'react';
import { useRunnerStore } from '../../../core/contexts/RunnerStore';

const OCFControls = memo(() => {
  return (
    <Controls position="top-left">
      <ControlButton onClick={() => useRunnerStore.getState().run()}>
        <FontAwesomeIcon className="text-success" icon={'play-circle'} />
      </ControlButton>
      <ControlButton onClick={() => useRunnerStore.getState().stop()}>
        <FontAwesomeIcon className="text-danger" icon={'stop-circle'} />
      </ControlButton>
    </Controls>
  );
});

export default OCFControls;
