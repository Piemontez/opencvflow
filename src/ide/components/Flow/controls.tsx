import { ControlButton, Controls } from 'reactflow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { memo } from 'react';

const OCFControls = memo((props: any) => {
  console.log(props);
  console.log(props.theme);
  return (
    <Controls position="top-right">
      <ControlButton onClick={() => useNodeStore.getState().run()}>
        <FontAwesomeIcon className="text-success" icon={'play-circle'} />
      </ControlButton>
      <ControlButton onClick={() => useNodeStore.getState().stop()}>
        <FontAwesomeIcon className="text-danger" icon={'stop-circle'} />
      </ControlButton>
    </Controls>
  );
});

export default OCFControls;
