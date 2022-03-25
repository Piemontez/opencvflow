import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from "./types/CVFFormProps";
import { CVFPicker } from './cvf-picker';

export class OCVThresholdTypesFormControl extends Component<CVFFormProps> {
  pickerRef: any = null;

  render() {
    //const value = this.props.value as ThresholdTypess;
    let option = this.props.description;
    if (!option) {
      if (typeof this.props.value === 'string') option = this.props.value;
      else option = '';
    }
    return (
      <>
        <Form.Control
          autoComplete="off"
          as="select"
          name={this.props.name}
          value={this.props.value}
          onMouseDown={() => this.pickerRef.show()}
        >
          <option>{option}</option>
        </Form.Control>
        <ThresholdTypesPicker
          onSel={(value: any | null, row: any, event: any) =>
            this.props.onChange && this.props.onChange(value, row, event)
          }
          title={this.props.title || 'Threshold Types'}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class ThresholdTypesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      {
        value: cv.THRESH_BINARY,
        columns: ['THRESH_BINARY', cv.THRESH_BINARY.toString()],
      },
      {
        value: cv.THRESH_BINARY_INV,
        columns: ['THRESH_BINARY_INV', cv.THRESH_BINARY_INV.toString()],
      },
      {
        value: cv.THRESH_TRUNC,
        columns: ['THRESH_TRUNC', cv.THRESH_TRUNC.toString()],
      },
      {
        value: cv.THRESH_TOZERO,
        columns: ['THRESH_TOZERO', cv.THRESH_TOZERO.toString()],
      },
      {
        value: cv.THRESH_TOZERO_INV,
        columns: ['THRESH_TOZERO_INV', cv.THRESH_TOZERO_INV.toString()],
      },
      {
        value: cv.THRESH_MASK,
        columns: ['THRESH_MASK', cv.THRESH_MASK.toString()],
      },
      {
        value: cv.THRESH_OTSU,
        columns: ['THRESH_OTSU', cv.THRESH_OTSU.toString()],
      },
      {
        value: cv.THRESH_TRIANGLE,
        columns: ['THRESH_TRIANGLE', cv.THRESH_TRIANGLE.toString()],
      },
    ];
  }
}
