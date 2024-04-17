import { Button, ButtonGroup } from 'react-bootstrap';
import NodeStore from '../../contexts/NodeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Controls = () => {
  return (
    <ButtonGroup
      className="controls"
      style={{ zIndex: 5, position: 'absolute', left: 10, marginTop: 10 }}
    >
      <Button
        onClick={() => NodeStore.run()}
        variant="outline-secondary"
        size="sm"
      >
        <FontAwesomeIcon className="text-success" icon={'play-circle'} /> Run
      </Button>
      <Button
        onClick={() => NodeStore.stop()}
        variant="outline-secondary"
        size="sm"
      >
        <FontAwesomeIcon className="text-danger" icon={'stop-circle'} /> Stop
      </Button>
    </ButtonGroup>
  );
};

export default Controls;
