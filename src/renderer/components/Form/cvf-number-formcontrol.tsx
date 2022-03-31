import numeral from 'numeral';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';

export function CVFIntegerFormControl(props: CVFFormProps) {
  return (
    <Form.Control
      autoComplete="off"
      type="number"
      name={props.name}
      disabled={props.disabled}
      value={(props.description || props.value) + ''}
      onChange={(event) => {
        if (props.onChange) {
          const parser = numeral(event.target.value);
          props.onChange(parser.value(), parser.format(), event);
        }
      }}
    />
  );
}

export function CVFDecimalFormControl(props: CVFFormProps) {
  return (
    <Form.Control
      autoComplete="off"
      type="text"
      name={props.name}
      disabled={props.disabled}
      value={(props.description || props.value) + ''}
      onChange={(event) => {
        if (props.onChange) {
          const parser = numeral(event.target.value);
          props.onChange(parser.value(), parser.format(), event);
        }
      }}
    />
  );
}
