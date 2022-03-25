import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { PropertyType } from 'renderer/types/property';
import { CVFBooleanFormControl } from './cvf-boolean-formcontrol';
import { CVFChoiceFormControl } from './cvf-choice-formcontrol';
import { CVFFileUrlFormControl } from './cvf-fileurl-formcontrol';
import { OCVOneZeroMatrixFormControl } from './cvf-matrix-formcontrol';
import {
  CVFDecimalFormControl,
  CVFIntegerFormControl,
} from './cvf-number-formcontrol';
import { CVFTextFormControl } from './cvf-text-formcontrol';
import { CVFFormProps } from './types/CVFFormProps';
import { OCVBorderTypeFormControl } from './ocv-bordertype-formcontrol';
import { OCVColorConversionCodesFormControl } from './ocv-colorconversioncodes-formcontrol';
import { OCVPointFormControl } from './ocv-point-formcontrol';
import { OCVScalarFormControl } from './ocv-scalar-formcontrol';
import { OCVSizeFormControl } from './ocv-size-formcontrol';
import { OCVThresholdTypesFormControl } from './ocv-thresholdtypes-formcontrol';
import { CVFFormEvent } from './types/CVFFormEvent';

/**
 * Definição da função chamada ao alterar um formulario
 *
 */
export declare type CVFFormEventHandler = (
  value: any | null,
  description: string[] | string | null,
  event: CVFFormEvent
) => void;

export function CVFFormGroup(props: CVFFormProps) {
  let Control, Column;
  switch (props.type) {
    //Open
    case PropertyType.BorderType:
      Control = <OCVBorderTypeFormControl {...props} />;
      break;
    case PropertyType.ThresholdTypes:
      Control = <OCVThresholdTypesFormControl {...props} />;
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
    case PropertyType.FileUrl:
      Control = CVFFileUrlFormControl(props);
      break;
    case PropertyType.OneZeroMatrix:
      Control = OCVOneZeroMatrixFormControl(props);
      break;
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
