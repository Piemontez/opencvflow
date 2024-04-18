import cv, { Size } from 'opencv-ts';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';

export function OCVSizeFormControl(props: CVFFormProps) {
  const value = props.value as Size;
  return (
    <Row>
      <Col>
        <Form.Control
          placeholder={'width'}
          autoComplete="off"
          type="number"
          name={props.name}
          disabled={props.disabled}
          value={value?.width}
          onChange={(event) => {
            if (props.onChange) {
              const parse = parseFloat(event.target.value);
              props.onChange(new cv.Size(parse || 0, value.height || 0), null, event);
            }
          }}
        />
      </Col>
      <Col>
        <Form.Control
          placeholder={'height'}
          autoComplete="off"
          type="number"
          name={props.name}
          disabled={props.disabled}
          value={value?.height}
          onChange={(event) => {
            if (props.onChange) {
              const parse = parseFloat(event.target.value);
              props.onChange(new cv.Size(value?.width || 0, parse || 0), null, event);
            }
          }}
        />
      </Col>
    </Row>
  );
}
