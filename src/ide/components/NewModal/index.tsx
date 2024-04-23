import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNewModalStore } from '../../contexts/NewModalStore';
import { useShallow } from 'zustand/react/shallow';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { memo } from 'react';

const NewModal = memo(() => {
  const newModalState = useNewModalStore(useShallow((state) => state));

  return (
    <Modal id="newmodal" size="lg" show={newModalState.isShow} onHide={newModalState.close} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
        <Form>
          <Form.Group as={Row}>
            <Form.Label column>Project name:</Form.Label>
            <Col md="8">
              <Form.Control type="name" autoFocus />
            </Col>
          </Form.Group>
        </Form>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row id="samples">
          <SideGroups />
          <SampleProjects />
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={newModalState.close}>
          Close
        </Button>
        <Button variant="primary" onClick={newModalState.create}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

const SideGroups = () => {
  const [groups, groupSelected, changeGroup] = useNewModalStore(useShallow((state) => [state.groups, state.groupSelected, state.changeGroup]));

  return (
    <Col sm={2} className="filters">
      {groups.map((group) => (
        <Button variant="ligth" active={group === groupSelected} onClick={() => changeGroup(group)} key={group}>
          {group}
        </Button>
      ))}
    </Col>
  );
};

const SampleProjects = () => {
  const [templates, templateSelected, groupSelected, changeTemplate] = useNewModalStore(
    useShallow((state) => [state.templates, state.templateSelected, state.groupSelected, state.changeTemplate]),
  );
  return (
    <Col className="list">
      {templates
        .filter((template) => template.group === groupSelected)
        .map((template) => (
          <Card border={template === templateSelected ? 'secondary' : ''} onClick={() => changeTemplate(template)} key={template.title}>
            {/* <Card.Img src="holder.js/100px270" alt="Card image" /> */}
            <Card.ImgOverlay>
              <Card.Title>{template.title}</Card.Title>
            </Card.ImgOverlay>
          </Card>
        ))}
    </Col>
  );
};

export default NewModal;
