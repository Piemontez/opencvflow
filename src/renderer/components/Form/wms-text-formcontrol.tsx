import React from 'react';
import Form from 'react-bootstrap/Form';
import { WmsFormProps } from './index';

export function WmsTextFormControl(props: WmsFormProps) {
  return (
    <Form.Control
      autoComplete="off"
      className={props.controlClassName}
      type={!props.multiline ? 'text' : undefined}
      as={props.multiline ? 'textarea' : undefined}
      rows={props.multiline}
      placeholder={props.placeholder}
      name={props.name}
      disabled={props.disabled}
      value={props.description || props.value || ''}
      onChange={(event) => props.onChange && props.onChange(event.target.value, event.target.value, event)}
    />
  );
}
