import { Button, Col, Form, Row } from 'react-bootstrap';
import { CVFComponent, CVFComponentOptions } from '../NodeComponent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { Zoom } from '../../types/Zoom';

const NodeTab = ({ component }: { component: CVFComponent }) => {
  const { scale: zoom, options } = component.state;
  const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
  return (
    <div className="node-header">
      <Row>
        <Col>{component.title}</Col>
        <Col xs={5}>
          <Button variant="outline-light" size="sm" onClick={() => useNodeStore.getState().removeNode(component.props.id)}>
            <FontAwesomeIcon icon={'window-close'} />
          </Button>
          <Button
            variant="outline-light"
            size="sm"
            onClick={() =>
              notDisplay ? component.removeOption(CVFComponentOptions.NOT_DISPLAY) : component.addOption(CVFComponentOptions.NOT_DISPLAY)
            }
          >
            <FontAwesomeIcon className={notDisplay ? 'text-danger' : ''} icon={notDisplay ? 'eye-slash' : 'eye'} />
          </Button>
          <Form.Select
            value={(zoom as number).toFixed ? (zoom as number).toFixed(2) : zoom}
            onChange={(e) => component.changeScale(e.target.value === Zoom.PERC_AUTO ? Zoom.PERC_AUTO : parseFloat(e.target.value || '1'))}
          >
            <option>Zoom</option>
            <option value={Zoom.PERC_025}>25%</option>
            <option value={Zoom.PERC_033}>33%</option>
            <option value={Zoom.PERC_050}>50%</option>
            <option value={Zoom.PERC_075}>75%</option>
            <option value={Zoom.PERC_100}>100%</option>
            <option value={Zoom.PERC_150}>150%</option>
            <option value={Zoom.PERC_200}>200%</option>
            <option value={Zoom.PERC_AUTO}>Auto scale</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
};

export default NodeTab;
