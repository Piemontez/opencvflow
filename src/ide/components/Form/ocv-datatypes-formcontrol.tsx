import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFPicker } from './cvf-picker';

export class OCVDataTypeTypesFormControl extends Component<CVFFormProps> {
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
        <DataTypesPicker
          onSel={(value: any | null, row: any, event: any) => this.props.onChange && this.props.onChange(value, row, event)}
          title={this.props.title || 'Distance Types'}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class DataTypesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      { value: cv.CV_8U, columns: ['CV_8U', cv.CV_8U.toString()] },
      { value: cv.CV_8S, columns: ['CV_8S', cv.CV_8S.toString()] },
      { value: cv.CV_16U, columns: ['CV_16U', cv.CV_16U.toString()] },
      { value: cv.CV_16S, columns: ['CV_16S', cv.CV_16S.toString()] },
      { value: cv.CV_32S, columns: ['CV_32S', cv.CV_32S.toString()] },
      { value: cv.CV_32F, columns: ['CV_32F', cv.CV_32F.toString()] },
      { value: cv.CV_64F, columns: ['CV_64F', cv.CV_64F.toString()] },
      //{ value: cv.CV_16F, columns: ['CV_16F', cv.CV_16F.toString()] },
      { value: cv.CV_8UC1, columns: ['CV_8UC1', cv.CV_8UC1.toString()] },
      { value: cv.CV_8UC2, columns: ['CV_8UC2', cv.CV_8UC2.toString()] },
      { value: cv.CV_8UC3, columns: ['CV_8UC3', cv.CV_8UC3.toString()] },
      { value: cv.CV_8UC4, columns: ['CV_8UC4', cv.CV_8UC4.toString()] },
      { value: cv.CV_8SC1, columns: ['CV_8SC1', cv.CV_8SC1.toString()] },
      { value: cv.CV_8SC2, columns: ['CV_8SC2', cv.CV_8SC2.toString()] },
      { value: cv.CV_8SC3, columns: ['CV_8SC3', cv.CV_8SC3.toString()] },
      { value: cv.CV_8SC4, columns: ['CV_8SC4', cv.CV_8SC4.toString()] },
      { value: cv.CV_16UC1, columns: ['CV_16UC1', cv.CV_16UC1.toString()] },
      { value: cv.CV_16UC2, columns: ['CV_16UC2', cv.CV_16UC2.toString()] },
      { value: cv.CV_16UC3, columns: ['CV_16UC3', cv.CV_16UC3.toString()] },
      { value: cv.CV_16UC4, columns: ['CV_16UC4', cv.CV_16UC4.toString()] },
      { value: cv.CV_16SC1, columns: ['CV_16SC1', cv.CV_16SC1.toString()] },
      { value: cv.CV_16SC2, columns: ['CV_16SC2', cv.CV_16SC2.toString()] },
      { value: cv.CV_16SC3, columns: ['CV_16SC3', cv.CV_16SC3.toString()] },
      { value: cv.CV_16SC4, columns: ['CV_16SC4', cv.CV_16SC4.toString()] },
      { value: cv.CV_32SC1, columns: ['CV_32SC1', cv.CV_32SC1.toString()] },
      { value: cv.CV_32SC2, columns: ['CV_32SC2', cv.CV_32SC2.toString()] },
      { value: cv.CV_32SC3, columns: ['CV_32SC3', cv.CV_32SC3.toString()] },
      { value: cv.CV_32SC4, columns: ['CV_32SC4', cv.CV_32SC4.toString()] },
      { value: cv.CV_32FC1, columns: ['CV_32FC1', cv.CV_32FC1.toString()] },
      { value: cv.CV_32FC2, columns: ['CV_32FC2', cv.CV_32FC2.toString()] },
      { value: cv.CV_32FC3, columns: ['CV_32FC3', cv.CV_32FC3.toString()] },
      { value: cv.CV_32FC4, columns: ['CV_32FC4', cv.CV_32FC4.toString()] },
      { value: cv.CV_64FC1, columns: ['CV_64FC1', cv.CV_64FC1.toString()] },
      { value: cv.CV_64FC2, columns: ['CV_64FC2', cv.CV_64FC2.toString()] },
      { value: cv.CV_64FC3, columns: ['CV_64FC3', cv.CV_64FC3.toString()] },
      { value: cv.CV_64FC4, columns: ['CV_64FC4', cv.CV_64FC4.toString()] },
      //{ value: cv.CV_16FC1, columns: ['CV_16FC1', cv.CV_16FC1.toString()] },
      //{ value: cv.CV_16FC2, columns: ['CV_16FC2', cv.CV_16FC2.toString()] },
      //{ value: cv.CV_16FC3, columns: ['CV_16FC3', cv.CV_16FC3.toString()] },
      //{ value: cv.CV_16FC4, columns: ['CV_16FC4', cv.CV_16FC4.toString()] },
    ];
  }
}
