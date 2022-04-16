import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFPicker } from './cvf-picker';

export class OCVMorphTypesFormControl extends Component<CVFFormProps> {
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
        <MorphTypesPicker
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

export class MorphTypesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      { value: cv.MORPH_ERODE, columns: ['MORPH_ERODE'] },
      { value: cv.MORPH_DILATE, columns: ['MORPH_DILATE'] },
      { value: cv.MORPH_OPEN, columns: ['MORPH_OPEN'] },
      { value: cv.MORPH_CLOSE, columns: ['MORPH_CLOSE'] },
      { value: cv.MORPH_GRADIENT, columns: ['MORPH_GRADIENT'] },
      { value: cv.MORPH_TOPHAT, columns: ['MORPH_TOPHAT'] },
      { value: cv.MORPH_BLACKHAT, columns: ['MORPH_BLACKHAT'] },
      { value: cv.MORPH_HITMISS, columns: ['MORPH_HITMISS'] },
    ];
  }
}
