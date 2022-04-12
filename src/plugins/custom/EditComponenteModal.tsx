import { Button, Col, Modal, Row } from 'react-bootstrap';
import React from 'react';
import { CVFFormGroup } from 'renderer/components/Form';
import { PropertyType } from 'renderer/types/property';
import { tabName } from './index';

export class EditComponenteModal extends React.Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      show: false,
    };
  }

  handleClose = () => this.setState({ show: false });
  handleShow = () => this.setState({ show: true });

  render() {
    const { name, show } = this.state;
    return (
      <Modal show={show} onHide={this.handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>New Component</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <CVFFormGroup
                type={PropertyType.Text}
                name="name"
                title="Component name"
                value={name}
                onChange={(name) => this.setState({ name })} />
            </Col>
            <Col>
              <CVFFormGroup
                type={PropertyType.Text}
                disabled
                name="name"
                title="Tab Bar Menu"
                value={tabName} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close without save
          </Button>
          <Button variant="primary" onClick={this.handleClose}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
