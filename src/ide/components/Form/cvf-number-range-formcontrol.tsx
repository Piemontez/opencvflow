import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFFormEvent } from './types/CVFFormEvent';

export function CVFIntegerRangeFormControl(props: CVFFormProps) {
  const value = props.value ?? props.min;
  const perc = Math.ceil(((value - props.min!) / (props.max! - props.min!)) * 100);
  const backPercStyle = { background: `linear-gradient(90deg, var(--bs-gray-600) ${perc - 5}%, var(--bs-dark) ${perc + 5}%)` };

  const changeValue = (event: CVFFormEvent, value: number) => {
    if (props.min && value < props.min) value = props.min;
    if (props.max && value > props.max) value = props.max;
    props.onChange!(value, '' + value, event);
  };

  return (
    <Form.Control
      autoComplete="off"
      type="number"
      name={props.name}
      disabled={props.disabled}
      value={(props.description || props.value) + ''}
      onChange={(event) => {
        if (props.onChange) {
          changeValue(event, parseInt(event.target.value));
        }
      }}
      onMouseDown={(event) => {
        const rect = (event.target as any).getBoundingClientRect();
        const x = event.clientX - rect.left;
        const perc = x / rect.width;

        if (perc < 0.86) {
          changeValue(event, Math.ceil(props.max! * perc));
        }
      }}
      style={backPercStyle}
    />
  );
}
