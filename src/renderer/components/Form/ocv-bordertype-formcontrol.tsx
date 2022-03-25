import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from "CVFFormProps";
import { CVFPicker } from './cvf-picker';

export class OCVBorderTypeFormControl extends Component<CVFFormProps> {
  pickerRef: any = null;

  render() {
    //const value = this.props.value as BorderTypes;
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
        <BorderTypePicker
          onSel={(value: any | null, row: any, event: any) =>
            this.props.onChange && this.props.onChange(value, row, event)
          }
          title={this.props.title}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class BorderTypePicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      {
        value: cv.BORDER_CONSTANT,
        columns: ['BORDER_CONSTANT', cv.BORDER_CONSTANT.toString()],
      },
      {
        value: cv.BORDER_REPLICATE,
        columns: ['BORDER_REPLICATE', cv.BORDER_REPLICATE.toString()],
      },
      {
        value: cv.BORDER_REFLECT,
        columns: ['BORDER_REFLECT', cv.BORDER_REFLECT.toString()],
      },
      {
        value: cv.BORDER_WRAP,
        columns: ['BORDER_WRAP', cv.BORDER_WRAP.toString()],
      },
      {
        value: cv.BORDER_REFLECT_101,
        columns: ['BORDER_REFLECT_101', cv.BORDER_REFLECT_101.toString()],
      },
      {
        value: cv.BORDER_TRANSPARENT,
        columns: ['BORDER_TRANSPARENT', cv.BORDER_TRANSPARENT.toString()],
      },
      {
        value: cv.BORDER_REFLECT101,
        columns: ['BORDER_REFLECT101', cv.BORDER_REFLECT101.toString()],
      },
      {
        value: cv.BORDER_DEFAULT,
        columns: ['BORDER_DEFAULT', cv.BORDER_REFLECT101.toString()],
      },
      {
        value: cv.BORDER_ISOLATED,
        columns: ['BORDER_ISOLATED', cv.BORDER_ISOLATED.toString()],
      },
    ];
  }
}
