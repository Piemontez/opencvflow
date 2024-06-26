import { Col, Row } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from "./types/CVFFormProps";

export function OCVScalarFormControl(props: CVFFormProps) {
  const length = (props.value as []).length;
  const posSeries = Array.from(Array(length).keys());
  return (
    <Row>
      {posSeries.map((pos) => (
        <Col key={pos}>
          <Form.Control
            placeholder={'x'}
            autoComplete="off"
            type="number"
            name={props.name}
            disabled={props.disabled}
            value={props.value[pos]}
            onChange={(event) => {
              if (props.onChange) {
                props.value[pos] = parseFloat(event.target.value) || null;
                props.onChange(props.value, null, event);
              }
            }}
          />
        </Col>
      ))}
    </Row>
  );
}
