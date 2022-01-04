import { Button, Col, Row } from 'react-bootstrap';
import NodeStore from 'renderer/contexts/NodeStore';
import { CVFComponent } from 'renderer/types/component';

const NodeTab = ({ component }: { component: CVFComponent }) => {
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
            X
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default NodeTab;
