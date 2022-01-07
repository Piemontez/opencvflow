import React from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { PropertyType } from 'renderer/types/property';
import { CVFBooleanFormControl } from './cvf-boolean-formcontrol';
import { CVFChoiceFormControl } from './cvf-choice-formcontrol';
import {
  CVFDecimalFormControl,
  CVFIntegerFormControl,
} from './cvf-number-formcontrol';
import { CVFTextFormControl } from './cvf-text-formcontrol';
import { OCVBorderTypeFormControl } from './ocv-bordertype-formcontrol';
import { OCVColorConversionCodesFormControl } from './ocv-colorconversioncodes-formcontrol';
import { OCVPointFormControl } from './ocv-point-formcontrol';
import { OCVScalarFormControl } from './ocv-scalar-formcontrol';
import { OCVSizeFormControl } from './ocv-size-formcontrol';

/**
 * Definição das opções de um campo selecionavel
 */

export type CVFOptionValue = {
  value: any;
  columns: string[];
};
export type CVFFormEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | React.SyntheticEvent<any>;
/**
 * Definição da função chamada ao alterar um formulario
 *
 */
declare type CVFFormEventHandler = (
  value: any | null,
  description: string[] | string | null,
  event: CVFFormEvent
) => void;

/**
 * Propriedades do formulário
 */
export declare type CVFFormProps = {
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
  options?: CVFOptionValue[];
  //control
  controlClassName?: string;

  onChange?: CVFFormEventHandler;
};

export function CVFFormGroup(props: CVFFormProps) {
  let Control, Column;
  switch (props.type) {
    //Open
    case PropertyType.BorderType:
      Control = <OCVBorderTypeFormControl {...props} />;
      break;
    case PropertyType.ColorConversionCodes:
      Control = <OCVColorConversionCodesFormControl {...props} />;
      break;
    case PropertyType.Scalar:
      Control = OCVScalarFormControl(props);
      break;
    case PropertyType.Size:
      Control = OCVSizeFormControl(props);
      break;
    case PropertyType.Point:
      Control = OCVPointFormControl(props);
      break;
    //Default
    case PropertyType.Text:
      Control = CVFTextFormControl(props);
      break;
    case PropertyType.Boolean:
      Control = CVFBooleanFormControl(props);
      break;
    case PropertyType.MultiChoice:
      props.multi = true;
      Control = CVFChoiceFormControl(props);
      break;
    case PropertyType.Choice:
      Control = CVFChoiceFormControl(props);
      break;
    case PropertyType.Decimal:
      Control = CVFDecimalFormControl(props);
      break;
    case PropertyType.Integer:
    default:
      Control = CVFIntegerFormControl(props);
      break;
  }
  Column = props.column ? <Col>{Control}</Col> : Control;
  return (
    <Form.Group as={props.groupAs}>
      {props.title && (
        <Form.Label column={props.column} sm={props.column ? 3 : undefined}>
          {props.title}
        </Form.Label>
      )}
      {Column}
    </Form.Group>
  );
}
