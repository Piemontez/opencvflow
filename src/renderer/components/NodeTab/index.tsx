import { Button, Col, Form, Row } from 'react-bootstrap';
import NodeStore from 'renderer/contexts/NodeStore';
import { CVFComponent, CVFComponentOptions } from 'renderer/types/component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NodeTab = ({ component }: { component: CVFComponent }) => {
  const { zoom, options } = component.state;
  const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
  return (
    <div className="node-header">
      <Row>
        <Col>{component.title}</Col>
        <Col xs={5}>
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
          <Form.Select
            value={zoom.toFixed(2)}
            size="sm"
            aria-label="Zoom"
            onChange={(e) =>
              component.changeZoom(parseFloat(e.target.value || '1'))
            }
          >
            <option>Zoom</option>
            <option value="0.25">25%</option>
            <option value="0.33">33%</option>
            <option value="0.50">50%</option>
            <option value="0.75">75%</option>
            <option value="1.00">100%</option>
            <option value="1.50">150%</option>
            <option value="2.00">200%</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
};

export default NodeTab;
