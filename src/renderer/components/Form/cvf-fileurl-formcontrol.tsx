import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';

export function CVFFileUrlFormControl(props: CVFFormProps) {
  return (
    <Form.Control
      autoComplete="off"
      className={props.controlClassName}
      type={'file'}
      placeholder={props.description || props.value || ''}
      name={props.name}
      disabled={props.disabled}
      onChange={(event) => {
        const files = (event.target as HTMLInputElement).files;
        props.onChange &&
          props.onChange(
            files?.length ? files[0] : null,
            event.target.value,
            event
          );
      }}
    />
  );
}
