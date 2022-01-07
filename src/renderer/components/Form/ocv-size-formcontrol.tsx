import cv, { Size } from 'opencv-ts';
import numeral from 'numeral';
import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './index';

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
              const parser = numeral(event.target.value);
              props.onChange(
                new cv.Size(parser.value() || 0, value.height || 0),
                null,
                event
              );
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
              const parser = numeral(event.target.value);
              props.onChange(
                new cv.Size(value?.width || 0, parser.value() || 0),
                null,
                event
              );
            }
          }}
        />
      </Col>
    </Row>
  );
}
