import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useNewModalStore } from '../../contexts/NewModalStore';
import { useShallow } from 'zustand/react/shallow';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { memo } from 'react';
import { DonateBody } from '../Donate';

const NewModal = memo(() => {
  const [isShow, create, close, projectName, changeProjectName] = useNewModalStore(
    useShallow((state) => [
      //
      state.isShow,
      state.create,
      state.close,
      state.projectName,
      state.changeProjectName,
    ]),
  );

  return (
    <Modal id="newmodal" size="lg" show={isShow} onHide={close} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>
          <Form>
            <Form.Group as={Row}>
              <Form.Label column>Project name:</Form.Label>
              <Col md="8">
                <Form.Control type="name" value={projectName} onChange={(e) => changeProjectName(e.target.value)} autoFocus />
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
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
        <Button variant="primary" onClick={create}>
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
      <Button variant="ligth" active={'donate' === groupSelected} onClick={() => changeGroup('donate')}>
        Donate
      </Button>
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
      {groupSelected === 'donate' && <DonateCard />}
    </Col>
  );
};

const DonateCard = () => {
  return (
    <Card id="donate">
      <Card.Body>
        <Card.Title>Donate</Card.Title>
        <Card.Text>
          <DonateBody />
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default NewModal;
