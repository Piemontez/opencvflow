import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { PropertyType } from '../../types/PropertyType';
import { CVFBooleanFormControl } from './cvf-boolean-formcontrol';
import { CVFChoiceFormControl } from './cvf-choice-formcontrol';
import { CVFFileUrlFormControl } from './cvf-fileurl-formcontrol';
import { OCVIntMatrixFormControl, OCVOneZeroMatrixFormControl } from './cvf-matrix-formcontrol';
import { CVFDecimalFormControl, CVFIntegerFormControl } from './cvf-number-formcontrol';
import { CVFTextFormControl } from './cvf-text-formcontrol';
import { CVFFormProps } from './types/CVFFormProps';
import { OCVBorderTypeFormControl } from './ocv-bordertype-formcontrol';
import { OCVColorConversionCodesFormControl } from './ocv-colorconversioncodes-formcontrol';
import { OCVPointFormControl } from './ocv-point-formcontrol';
import { OCVScalarFormControl } from './ocv-scalar-formcontrol';
import { OCVSizeFormControl } from './ocv-size-formcontrol';
import { OCVThresholdTypesFormControl } from './ocv-thresholdtypes-formcontrol';
import { CVFFormEvent } from './types/CVFFormEvent';
import { OCVDistanceTypesFormControl } from './ocv-distancetypes-formcontrol';
import { OCVMorphTypesFormControl } from './ocv-morphtypes-formcontrol';
import { OCVDataTypeTypesFormControl } from './ocv-datatypes-formcontrol';
import { OCVNormTypesFormControl } from './ocv-normtypes-formcontrol';
import { CVFIntegerRangeFormControl } from './cvf-number-range-formcontrol';

/**
 * Definição da função chamada ao alterar um formulario
 *
 */
export declare type CVFFormEventHandler = (value: any | null, description: string[] | string | null, event: CVFFormEvent) => void;

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
    case PropertyType.MorphTypes:
      Control = <OCVMorphTypesFormControl {...props} />;
      break;
    case PropertyType.ColorConversionCodes:
      Control = <OCVColorConversionCodesFormControl {...props} />;
      break;
    case PropertyType.DistanceTypes:
      Control = <OCVDistanceTypesFormControl {...props} />;
      break;
    case PropertyType.NormTypes:
      Control = <OCVNormTypesFormControl {...props} />;
      break;
    case PropertyType.DataTypes:
      Control = <OCVDataTypeTypesFormControl {...props} />;
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
    case PropertyType.DoubleMatrix:
    case PropertyType.IntMatrix:
      Control = OCVIntMatrixFormControl(props);
      break;
    case PropertyType.OneZeroMatrix:
      Control = OCVOneZeroMatrixFormControl(props);
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
      Control = CVFIntegerFormControl(props);
      break;
    case PropertyType.IntegerRange:
      Control = CVFIntegerRangeFormControl(props);
      break;
    case PropertyType.Label:
      props = { ...props, disabled: true };
      Control = CVFTextFormControl(props);
      break;
    case PropertyType.Text:
    default:
      Control = CVFTextFormControl(props);
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
