import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './index';

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
        const url = files?.length ? URL.createObjectURL(files[0]) : null;
        props.onChange && props.onChange(url, event.target.value, event)
      }}
    />
  );
}
