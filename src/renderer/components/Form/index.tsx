import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { PropertyType } from 'renderer/types/property';
import { WmsBooleanFormControl } from './wms-boolean-formcontrol';
import { WmsChoiceFormControl } from './wms-choice-formcontrol';
import {
  WmsDecimalFormControl,
  WmsIntegerFormControl,
} from './wms-number-formcontrol';
import { WmsTextFormControl } from './wms-text-formcontrol';

/**
 * Definição das opções de um campo selecionavel
 */

export type WmsOptionValue = {
  value: any;
  columns: string[];
};
export type WmsFormEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | React.SyntheticEvent<any>;
/**
 * Definição da função chamada ao alterar um formulario
 *
 */
declare type WmsFormEventHandler = (
  value: any | null,
  description: string[] | string | null,
  event: WmsFormEvent
) => void;

/**
 * Propriedades do formulário
 */
export declare type WmsFormProps = {
  type: PropertyType;
  name: string;
  title?: string;
  placeholder?: string;
  value?: any | [any] | null;
  description?: string;
  disabled?: boolean;

  filters?: any;
  //propriedade do formGroup
  groupAs?: any;
  column?: any;
  //propriedades do campo text
  multiline?: number;
  //propriedades do campo boolean
  checked?: boolean;
  //propriedades do campo selecionável
  multi?: boolean;
  header?: string[];
  options?: WmsOptionValue[];
  //control
  controlClassName?: string;

  onChange?: WmsFormEventHandler;
};

export function WmsFormGroup(props: WmsFormProps) {
  let Control, Column;
  switch (props.type) {
    case PropertyType.Text:
      Control = WmsTextFormControl(props);
      break;
    case PropertyType.Decimal:
      Control = WmsDecimalFormControl(props);
      break;
    case PropertyType.Boolean:
      Control = WmsBooleanFormControl(props);
      break;
    case PropertyType.MultiChoice:
      props.multi = true;
      Control = WmsChoiceFormControl(props);
      break;
    case PropertyType.Choice:
      Control = WmsChoiceFormControl(props);
      break;
    case PropertyType.Integer:
    default:
      Control = WmsIntegerFormControl(props);
      break;
  }
  Column = props.column ? <Col>{Control}</Col> : Control;
  return (
    <Form.Group as={props.groupAs}>
      {props.title && (
        <Form.Label column={props.column} sm={props.column ? 2 : undefined}>
          {props.title}
        </Form.Label>
      )}
      {Column}
    </Form.Group>
  );
}
