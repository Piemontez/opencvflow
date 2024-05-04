import { Button, ButtonGroup, Col, Dropdown, DropdownButton, Modal, Row } from 'react-bootstrap';
import { CVFComponent } from '.';
import { CVFComponentOptions } from './CVFComponentOptions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { ZoomScale } from '../../types/ZoomScale';
import { useState } from 'react';

const NodeMenu = ({ component }: { component: CVFComponent }) => {
  const { options } = component.state;
  const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;

  const [sourceOf, setSourceOf] = useState<any>();

  return (
    <div className="node-header">
      <Row>
        <Col>{component.title}</Col>
        <Col xs={5}>
          {!!sourceOf && <SourceModal sourceOf={sourceOf} setSourceOf={setSourceOf} />}
          <ButtonGroup style={{ float: 'right' }}>
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
            <DropdownButton size="sm" as={ButtonGroup} title={<FontAwesomeIcon icon={'bars'} />}>
              <Dropdown.Item onClick={() => setSourceOf(component)}>Show source</Dropdown.Item>
              <Dropdown.Item onClick={() => component.toggleOption(CVFComponentOptions.NOT_DISPLAY)}>
                <FontAwesomeIcon className={notDisplay ? 'text-danger' : ''} icon={notDisplay ? 'eye-slash' : 'eye'} /> Toggle view or hide
              </Dropdown.Item>
            </DropdownButton>
            <Button variant="outline-light" size="sm" onClick={() => component.toggleOption(CVFComponentOptions.NOT_DISPLAY)}>
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

const SourceModal = ({ sourceOf, setSourceOf }: { sourceOf: CVFComponent; setSourceOf: (x: any) => void }) => {
  return (
    <Modal show={true} size="xl">
      <Modal.Header>
        <Modal.Title>Source Code Of {sourceOf.constructor.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: '60vh', overflow: 'auto' }}>
        <pre>{sourceOf.constructor.toString()}</pre>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setSourceOf(null)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NodeMenu;
