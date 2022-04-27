import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import brasilIcon from 'renderer/assets/imgs/brasil-48.png';
import anarchismIcon from 'renderer/assets/imgs/anarchism.png';
import { dependencies, version } from '../../../../package.json';

export default class About extends React.Component {
  state = {
    show: false,
  };

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    const { show } = this.state;

    return (
      <Modal show={show} onHide={this.handleClose}>
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
          Monaco Editor: {dependencies['monaco-editor']}
          <br />
          React: {dependencies.react}
        </Modal.Body>
        <Modal.Footer>
          <img src={brasilIcon} height="16" alt="brazil" />{' '}
          <img src={anarchismIcon} height="16" alt="anarchism" />
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
