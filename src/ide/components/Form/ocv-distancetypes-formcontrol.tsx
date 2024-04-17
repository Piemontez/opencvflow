import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFPicker } from './cvf-picker';

export class OCVDistanceTypesFormControl extends Component<CVFFormProps> {
  pickerRef: any = null;

  render() {
    let option = this.props.description;
    if (!option) {
      option = '' + this.props.value;
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
        <DistanceTypesPicker
          onSel={(value: any | null, row: any, event: any) =>
            this.props.onChange && this.props.onChange(value, row, event)
          }
          title={this.props.title || 'Distance Types'}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class DistanceTypesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      { value: cv.DIST_USER, columns: ['DIST_USER', cv.DIST_USER.toString()] },
      { value: cv.DIST_L1, columns: ['DIST_L1', cv.DIST_L1.toString()] },
      { value: cv.DIST_L2, columns: ['DIST_L2', cv.DIST_L2.toString()] },
      { value: cv.DIST_C, columns: ['DIST_C', cv.DIST_C.toString()] },
      { value: cv.DIST_L12, columns: ['DIST_L12', cv.DIST_L12.toString()] },
      { value: cv.DIST_FAIR, columns: ['DIST_FAIR', cv.DIST_FAIR.toString()] },
      {
        value: cv.DIST_WELSCH,
        columns: ['DIST_WELSCH', cv.DIST_WELSCH.toString()],
      },
      {
        value: cv.DIST_HUBER,
        columns: ['DIST_HUBER', cv.DIST_HUBER.toString()],
      },
    ];
  }
}
