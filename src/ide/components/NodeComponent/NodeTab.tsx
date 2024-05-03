import { Button, ButtonGroup, Col, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import { CVFComponent } from '.';
import { CVFComponentOptions } from './CVFComponentOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { ZoomScale } from '../../types/ZoomScale';

const NodeTab = ({ component }: { component: CVFComponent }) => {
  const { options } = component.state;
  const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
  return (
    <div className="node-header">
      <Row>
        <Col>{component.title}</Col>
        <Col xs={5}>
          <ButtonGroup aria-label="Basic example">
            {/* <DropdownButton size="sm"  title={<FontAwesomeIcon icon={'bars'} />}> */}
            {/* <Dropdown.Item eventKey="1">Show source</Dropdown.Item> */}
            {/* </DropdownButton> */}
            <DropdownButton size="sm" as={ButtonGroup} title={<FontAwesomeIcon icon={'magnifying-glass'} />}>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_025)}>25%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_033)}>33%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_050)}>50%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_075)}>75%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_100)}>100%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_150)}>150%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_200)}>200%</Dropdown.Item>
              <Dropdown.Item onClick={() => component.changeScale(ZoomScale.PERC_AUTO)}>Auto scale</Dropdown.Item>
            </DropdownButton>
            <Button
              variant="outline-light"
              size="sm"
              onClick={() =>
                notDisplay ? component.removeOption(CVFComponentOptions.NOT_DISPLAY) : component.addOption(CVFComponentOptions.NOT_DISPLAY)
              }
            >
              <FontAwesomeIcon className={notDisplay ? 'text-danger' : ''} icon={notDisplay ? 'eye-slash' : 'eye'} />
            </Button>
            <Button variant="outline-light" size="sm" onClick={() => useNodeStore.getState().removeNode(component.props.id)}>
              <FontAwesomeIcon icon={'window-close'} />
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </div>
  );
};

export default NodeTab;
