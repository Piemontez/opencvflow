import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNewModalStore } from '../../contexts/NewModalStore';
import { useShallow } from 'zustand/react/shallow';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { memo } from 'react';

const NewModal = memo(() => {
  const newModalState = useNewModalStore(useShallow((state) => state));

  return (
    <Modal show={newModalState.isShow} onHide={newModalState.close} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column>Name</Form.Label>
            <Col sm="11">
              <Form.Control type="name" autoFocus />
            </Col>
          </Form.Group>
        </Form>
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
          Criar
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
