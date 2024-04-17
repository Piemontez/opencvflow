import { Button, Modal } from 'react-bootstrap';
import brasilIcon from '../../assets/imgs/brasil-48.png';
import anarchismIcon from '../../assets/imgs/anarchism.png';
import { dependencies, version } from '../../../../package.json';
import { forwardRef, useImperativeHandle, useState } from 'react';

export type AboutRef = {
  handleShow: () => void;
};

const About = forwardRef<AboutRef, {}>((_, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useImperativeHandle(ref, () => ({
    handleShow: () => setShow(true),
  }));

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>OpenCV-Flow</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Open Computer Vision - Flow is an IDE for computer vision studies and
        testing.
        <br />
        <br />
        Version: {version}
        <br />
        OpenCV: 4.5 +
        <br />
        {/* Monaco Editor: {dependencies['monaco-editor']} */}
        <br />
        React: {dependencies.react}
      </Modal.Body>
      <Modal.Footer>
        <img src={brasilIcon} height="16" alt="brazil" />{' '}
        <img src={anarchismIcon} height="16" alt="anarchism" />
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export default About;
