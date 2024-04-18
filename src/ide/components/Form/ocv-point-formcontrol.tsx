import cv, { Point } from 'opencv-ts';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';

export function OCVPointFormControl(props: CVFFormProps) {
  const value = props.value as Point;
  return (
    <Row>
      <Col>
        <Form.Control
          placeholder={'x'}
          autoComplete="off"
          type="number"
          name={props.name}
          disabled={props.disabled}
          value={value?.x}
          onChange={(event) => {
            if (props.onChange) {
              const parse = parseFloat(event.target.value);
              props.onChange(new cv.Point(parse || 0, value.y || 0), null, event);
            }
          }}
        />
      </Col>
      <Col>
        <Form.Control
          placeholder={'y'}
          autoComplete="off"
          type="number"
          name={props.name}
          disabled={props.disabled}
          value={value?.y}
          onChange={(event) => {
            if (props.onChange) {
              const parse = parseFloat(event.target.value);
              props.onChange(new cv.Point(value.x || 0, parse || 0), null, event);
            }
          }}
        />
      </Col>
    </Row>
  );
}
