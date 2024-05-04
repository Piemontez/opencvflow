import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFPicker } from './cvf-picker';

export class OCVNormTypesFormControl extends Component<CVFFormProps> {
  pickerRef: any = null;

  render() {
    let option = this.props.description;
    if (!option) {
      option = '' + this.props.value;
    }
    return (
      <>
        <Form.Control autoComplete="off" as="select" name={this.props.name} value={this.props.value} onMouseDown={() => this.pickerRef.show()}>
          <option>{option}</option>
        </Form.Control>
        <NormTypesPicker
          onSel={(value: any | null, row: any, event: any) => this.props.onChange && this.props.onChange(value, row, event)}
          title={this.props.title || 'NormTypes Types'}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class NormTypesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      { value: cv.DIST_USER, columns: ['DIST_USER', cv.DIST_USER.toString()] },
      { value: cv.NORM_INF, columns: ['NORM_INF', cv.NORM_INF.toString()] },
      { value: cv.NORM_L1, columns: ['NORM_L1', cv.NORM_L1.toString()] },
      { value: cv.NORM_L2, columns: ['NORM_L2', cv.NORM_L2.toString()] },
      {
        value: cv.NORM_L2SQR,
        columns: ['NORM_L2SQR', cv.NORM_L2SQR.toString()],
      },
      {
        value: cv.NORM_HAMMING,
        columns: ['NORM_HAMMING', cv.NORM_HAMMING.toString()],
      },
      {
        value: cv.NORM_HAMMING2,
        columns: ['NORM_HAMMING2', cv.NORM_HAMMING2.toString()],
      },
      {
        value: cv.NORM_TYPE_MASK,
        columns: ['NORM_TYPE_MASK', cv.NORM_TYPE_MASK.toString()],
      },
      {
        value: cv.NORM_RELATIVE,
        columns: ['NORM_RELATIVE', cv.NORM_RELATIVE.toString()],
      },
      {
        value: cv.NORM_MINMAX,
        columns: ['NORM_MINMAX', cv.NORM_MINMAX.toString()],
      },
    ];
  }
}
