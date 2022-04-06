import { Button, Col, Row } from 'react-bootstrap';
import NodeStore from 'renderer/contexts/NodeStore';
import { CVFComponent, CVFComponentOptions } from 'renderer/types/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NodeTab = ({ component }: { component: CVFComponent }) => {
  const { options } = component.state;
  const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
  return (
    <div className="node-header">
      <Row>
        <Col>{component.title}</Col>
        <Col xs={3}>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() => NodeStore.removeNode(component.props.id)}
          >
            <FontAwesomeIcon icon={'window-close'} />
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() =>
              notDisplay
                ? component.removeOption(CVFComponentOptions.NOT_DISPLAY)
                : component.addOption(CVFComponentOptions.NOT_DISPLAY)
            }
          >
            <FontAwesomeIcon
              className={notDisplay ? 'text-danger' : ''}
              icon={notDisplay ? 'eye-slash' : 'eye'}
            />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default NodeTab;
