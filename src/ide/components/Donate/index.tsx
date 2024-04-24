import { forwardRef, useImperativeHandle, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export type DonateRef = {
  handleShow: () => void;
};

const Donate = forwardRef<DonateRef, {}>((_, ref) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  useImperativeHandle(ref, () => ({
    handleShow: () => setShow(true),
  }));

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Donate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DonateBody />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
});

export const DonateBody = () => {
  return (
    <>
      <p>From the founder, Rafael A. Piemontez</p>
      <p>Your donation will allow this tool to remain online and speed up the development of new improvements..</p>
      <p>Any contribution is welcome.</p>
      <br />
      <div className="d-grid gap-2">
        <Button
          variant="outline-primary"
          size="sm"
          href="https://www.paypal.com/donate/?business=ZATQ468EP5EZC&no_recurring=0&item_name=Your+[…]e+speed+of+development+of+new+improvements.&currency_code=BRL"
          target="_black"
        >
          By PayPal
        </Button>
      </div>
    </>
  );
};

export default Donate;
