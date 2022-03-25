import cv from 'opencv-ts';
import { Component } from 'react';
import Form from 'react-bootstrap/Form';
import { CVFFormProps } from './types/CVFFormProps';
import { CVFPicker } from './cvf-picker';

export class OCVColorConversionCodesFormControl extends Component<CVFFormProps> {
  pickerRef: any = null;

  render() {
    //const value = this.props.value as ColorConversionCodess;
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
        <ColorConversionCodesPicker
          onSel={(value: any | null, row: any, event: any) =>
            this.props.onChange && this.props.onChange(value, row, event)
          }
          title={this.props.title || 'Color Conversion Codes'}
          header={this.props.header}
          multi={this.props.multi}
          ref={(ref) => (this.pickerRef = ref)}
        />
      </>
    );
  }
}

export class ColorConversionCodesPicker extends CVFPicker {
  constructor(props: any) {
    super(props);

    this.state.contents = [
      {
        value: cv.COLOR_BGR2BGRA || '',
        columns: ['COLOR_BGR2BGRA', (cv.COLOR_BGR2BGRA || '').toString()],
      },
      {
        value: cv.COLOR_RGB2RGBA || '',
        columns: ['COLOR_RGB2RGBA', (cv.COLOR_RGB2RGBA || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2BGR || '',
        columns: ['COLOR_BGRA2BGR', (cv.COLOR_BGRA2BGR || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2RGB || '',
        columns: ['COLOR_RGBA2RGB', (cv.COLOR_RGBA2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2RGBA || '',
        columns: ['COLOR_BGR2RGBA', (cv.COLOR_BGR2RGBA || '').toString()],
      },
      {
        value: cv.COLOR_RGB2BGRA || '',
        columns: ['COLOR_RGB2BGRA', (cv.COLOR_RGB2BGRA || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2BGR || '',
        columns: ['COLOR_RGBA2BGR', (cv.COLOR_RGBA2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2RGB || '',
        columns: ['COLOR_BGRA2RGB', (cv.COLOR_BGRA2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2RGB || '',
        columns: ['COLOR_BGR2RGB', (cv.COLOR_BGR2RGB || '').toString()],
      },
      {
        value: cv.COLOR_RGB2BGR || '',
        columns: ['COLOR_RGB2BGR', (cv.COLOR_RGB2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2RGBA || '',
        columns: ['COLOR_BGRA2RGBA', (cv.COLOR_BGRA2RGBA || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2BGRA || '',
        columns: ['COLOR_RGBA2BGRA', (cv.COLOR_RGBA2BGRA || '').toString()],
      },
      {
        value: cv.COLOR_BGR2GRAY || '',
        columns: ['COLOR_BGR2GRAY', (cv.COLOR_BGR2GRAY || '').toString()],
      },
      {
        value: cv.COLOR_RGB2GRAY || '',
        columns: ['COLOR_RGB2GRAY', (cv.COLOR_RGB2GRAY || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2BGR || '',
        columns: ['COLOR_GRAY2BGR', (cv.COLOR_GRAY2BGR || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2RGB || '',
        columns: ['COLOR_GRAY2RGB', (cv.COLOR_GRAY2RGB || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2BGRA || '',
        columns: ['COLOR_GRAY2BGRA', (cv.COLOR_GRAY2BGRA || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2RGBA || '',
        columns: ['COLOR_GRAY2RGBA', (cv.COLOR_GRAY2RGBA || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2GRAY || '',
        columns: ['COLOR_BGRA2GRAY', (cv.COLOR_BGRA2GRAY || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2GRAY || '',
        columns: ['COLOR_RGBA2GRAY', (cv.COLOR_RGBA2GRAY || '').toString()],
      },
      {
        value: cv.COLOR_BGR2BGR565 || '',
        columns: ['COLOR_BGR2BGR565', (cv.COLOR_BGR2BGR565 || '').toString()],
      },
      {
        value: cv.COLOR_RGB2BGR565 || '',
        columns: ['COLOR_RGB2BGR565', (cv.COLOR_RGB2BGR565 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5652BGR || '',
        columns: ['COLOR_BGR5652BGR', (cv.COLOR_BGR5652BGR || '').toString()],
      },
      {
        value: cv.COLOR_BGR5652RGB || '',
        columns: ['COLOR_BGR5652RGB', (cv.COLOR_BGR5652RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2BGR565 || '',
        columns: ['COLOR_BGRA2BGR565', (cv.COLOR_BGRA2BGR565 || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2BGR565 || '',
        columns: ['COLOR_RGBA2BGR565', (cv.COLOR_RGBA2BGR565 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5652BGRA || '',
        columns: ['COLOR_BGR5652BGRA', (cv.COLOR_BGR5652BGRA || '').toString()],
      },
      {
        value: cv.COLOR_BGR5652RGBA || '',
        columns: ['COLOR_BGR5652RGBA', (cv.COLOR_BGR5652RGBA || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2BGR565 || '',
        columns: ['COLOR_GRAY2BGR565', (cv.COLOR_GRAY2BGR565 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5652GRAY || '',
        columns: ['COLOR_BGR5652GRAY', (cv.COLOR_BGR5652GRAY || '').toString()],
      },
      {
        value: cv.COLOR_BGR2BGR555 || '',
        columns: ['COLOR_BGR2BGR555', (cv.COLOR_BGR2BGR555 || '').toString()],
      },
      {
        value: cv.COLOR_RGB2BGR555 || '',
        columns: ['COLOR_RGB2BGR555', (cv.COLOR_RGB2BGR555 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5552BGR || '',
        columns: ['COLOR_BGR5552BGR', (cv.COLOR_BGR5552BGR || '').toString()],
      },
      {
        value: cv.COLOR_BGR5552RGB || '',
        columns: ['COLOR_BGR5552RGB', (cv.COLOR_BGR5552RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGRA2BGR555 || '',
        columns: ['COLOR_BGRA2BGR555', (cv.COLOR_BGRA2BGR555 || '').toString()],
      },
      {
        value: cv.COLOR_RGBA2BGR555 || '',
        columns: ['COLOR_RGBA2BGR555', (cv.COLOR_RGBA2BGR555 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5552BGRA || '',
        columns: ['COLOR_BGR5552BGRA', (cv.COLOR_BGR5552BGRA || '').toString()],
      },
      {
        value: cv.COLOR_BGR5552RGBA || '',
        columns: ['COLOR_BGR5552RGBA', (cv.COLOR_BGR5552RGBA || '').toString()],
      },
      {
        value: cv.COLOR_GRAY2BGR555 || '',
        columns: ['COLOR_GRAY2BGR555', (cv.COLOR_GRAY2BGR555 || '').toString()],
      },
      {
        value: cv.COLOR_BGR5552GRAY || '',
        columns: ['COLOR_BGR5552GRAY', (cv.COLOR_BGR5552GRAY || '').toString()],
      },
      {
        value: cv.COLOR_BGR2XYZ || '',
        columns: ['COLOR_BGR2XYZ', (cv.COLOR_BGR2XYZ || '').toString()],
      },
      {
        value: cv.COLOR_RGB2XYZ || '',
        columns: ['COLOR_RGB2XYZ', (cv.COLOR_RGB2XYZ || '').toString()],
      },
      {
        value: cv.COLOR_XYZ2BGR || '',
        columns: ['COLOR_XYZ2BGR', (cv.COLOR_XYZ2BGR || '').toString()],
      },
      {
        value: cv.COLOR_XYZ2RGB || '',
        columns: ['COLOR_XYZ2RGB', (cv.COLOR_XYZ2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2YCrCb || '',
        columns: ['COLOR_BGR2YCrCb', (cv.COLOR_BGR2YCrCb || '').toString()],
      },
      {
        value: cv.COLOR_RGB2YCrCb || '',
        columns: ['COLOR_RGB2YCrCb', (cv.COLOR_RGB2YCrCb || '').toString()],
      },
      {
        value: cv.COLOR_YCrCb2BGR || '',
        columns: ['COLOR_YCrCb2BGR', (cv.COLOR_YCrCb2BGR || '').toString()],
      },
      {
        value: cv.COLOR_YCrCb2RGB || '',
        columns: ['COLOR_YCrCb2RGB', (cv.COLOR_YCrCb2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2HSV || '',
        columns: ['COLOR_BGR2HSV', (cv.COLOR_BGR2HSV || '').toString()],
      },
      {
        value: cv.COLOR_RGB2HSV || '',
        columns: ['COLOR_RGB2HSV', (cv.COLOR_RGB2HSV || '').toString()],
      },
      {
        value: cv.COLOR_BGR2Lab || '',
        columns: ['COLOR_BGR2Lab', (cv.COLOR_BGR2Lab || '').toString()],
      },
      {
        value: cv.COLOR_RGB2Lab || '',
        columns: ['COLOR_RGB2Lab', (cv.COLOR_RGB2Lab || '').toString()],
      },
      {
        value: cv.COLOR_BGR2Luv || '',
        columns: ['COLOR_BGR2Luv', (cv.COLOR_BGR2Luv || '').toString()],
      },
      {
        value: cv.COLOR_RGB2Luv || '',
        columns: ['COLOR_RGB2Luv', (cv.COLOR_RGB2Luv || '').toString()],
      },
      {
        value: cv.COLOR_BGR2HLS || '',
        columns: ['COLOR_BGR2HLS', (cv.COLOR_BGR2HLS || '').toString()],
      },
      {
        value: cv.COLOR_RGB2HLS || '',
        columns: ['COLOR_RGB2HLS', (cv.COLOR_RGB2HLS || '').toString()],
      },
      {
        value: cv.COLOR_HSV2BGR || '',
        columns: ['COLOR_HSV2BGR', (cv.COLOR_HSV2BGR || '').toString()],
      },
      {
        value: cv.COLOR_HSV2RGB || '',
        columns: ['COLOR_HSV2RGB', (cv.COLOR_HSV2RGB || '').toString()],
      },
      {
        value: cv.COLOR_Lab2BGR || '',
        columns: ['COLOR_Lab2BGR', (cv.COLOR_Lab2BGR || '').toString()],
      },
      {
        value: cv.COLOR_Lab2RGB || '',
        columns: ['COLOR_Lab2RGB', (cv.COLOR_Lab2RGB || '').toString()],
      },
      {
        value: cv.COLOR_Luv2BGR || '',
        columns: ['COLOR_Luv2BGR', (cv.COLOR_Luv2BGR || '').toString()],
      },
      {
        value: cv.COLOR_Luv2RGB || '',
        columns: ['COLOR_Luv2RGB', (cv.COLOR_Luv2RGB || '').toString()],
      },
      {
        value: cv.COLOR_HLS2BGR || '',
        columns: ['COLOR_HLS2BGR', (cv.COLOR_HLS2BGR || '').toString()],
      },
      {
        value: cv.COLOR_HLS2RGB || '',
        columns: ['COLOR_HLS2RGB', (cv.COLOR_HLS2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2HSV_FULL || '',
        columns: [
          'COLOR_BGR2HSV_FULL',
          (cv.COLOR_BGR2HSV_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGB2HSV_FULL || '',
        columns: [
          'COLOR_RGB2HSV_FULL',
          (cv.COLOR_RGB2HSV_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGR2HLS_FULL || '',
        columns: [
          'COLOR_BGR2HLS_FULL',
          (cv.COLOR_BGR2HLS_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGB2HLS_FULL || '',
        columns: [
          'COLOR_RGB2HLS_FULL',
          (cv.COLOR_RGB2HLS_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_HSV2BGR_FULL || '',
        columns: [
          'COLOR_HSV2BGR_FULL',
          (cv.COLOR_HSV2BGR_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_HSV2RGB_FULL || '',
        columns: [
          'COLOR_HSV2RGB_FULL',
          (cv.COLOR_HSV2RGB_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_HLS2BGR_FULL || '',
        columns: [
          'COLOR_HLS2BGR_FULL',
          (cv.COLOR_HLS2BGR_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_HLS2RGB_FULL || '',
        columns: [
          'COLOR_HLS2RGB_FULL',
          (cv.COLOR_HLS2RGB_FULL || '').toString(),
        ],
      },
      {
        value: cv.COLOR_LBGR2Lab || '',
        columns: ['COLOR_LBGR2Lab', (cv.COLOR_LBGR2Lab || '').toString()],
      },
      {
        value: cv.COLOR_LRGB2Lab || '',
        columns: ['COLOR_LRGB2Lab', (cv.COLOR_LRGB2Lab || '').toString()],
      },
      {
        value: cv.COLOR_LBGR2Luv || '',
        columns: ['COLOR_LBGR2Luv', (cv.COLOR_LBGR2Luv || '').toString()],
      },
      {
        value: cv.COLOR_LRGB2Luv || '',
        columns: ['COLOR_LRGB2Luv', (cv.COLOR_LRGB2Luv || '').toString()],
      },
      {
        value: cv.COLOR_Lab2LBGR || '',
        columns: ['COLOR_Lab2LBGR', (cv.COLOR_Lab2LBGR || '').toString()],
      },
      {
        value: cv.COLOR_Lab2LRGB || '',
        columns: ['COLOR_Lab2LRGB', (cv.COLOR_Lab2LRGB || '').toString()],
      },
      {
        value: cv.COLOR_Luv2LBGR || '',
        columns: ['COLOR_Luv2LBGR', (cv.COLOR_Luv2LBGR || '').toString()],
      },
      {
        value: cv.COLOR_Luv2LRGB || '',
        columns: ['COLOR_Luv2LRGB', (cv.COLOR_Luv2LRGB || '').toString()],
      },
      {
        value: cv.COLOR_BGR2YUV || '',
        columns: ['COLOR_BGR2YUV', (cv.COLOR_BGR2YUV || '').toString()],
      },
      {
        value: cv.COLOR_RGB2YUV || '',
        columns: ['COLOR_RGB2YUV', (cv.COLOR_RGB2YUV || '').toString()],
      },
      {
        value: cv.COLOR_YUV2BGR || '',
        columns: ['COLOR_YUV2BGR', (cv.COLOR_YUV2BGR || '').toString()],
      },
      {
        value: cv.COLOR_YUV2RGB || '',
        columns: ['COLOR_YUV2RGB', (cv.COLOR_YUV2RGB || '').toString()],
      },
      {
        value: cv.COLOR_YUV2RGB_NV12 || '',
        columns: [
          'COLOR_YUV2RGB_NV12',
          (cv.COLOR_YUV2RGB_NV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_NV12 || '',
        columns: [
          'COLOR_YUV2BGR_NV12',
          (cv.COLOR_YUV2BGR_NV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_NV21 || '',
        columns: [
          'COLOR_YUV2RGB_NV21',
          (cv.COLOR_YUV2RGB_NV21 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_NV21 || '',
        columns: [
          'COLOR_YUV2BGR_NV21',
          (cv.COLOR_YUV2BGR_NV21 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420sp2RGB || '',
        columns: [
          'COLOR_YUV420sp2RGB',
          (cv.COLOR_YUV420sp2RGB || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420sp2BGR || '',
        columns: [
          'COLOR_YUV420sp2BGR',
          (cv.COLOR_YUV420sp2BGR || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_NV12 || '',
        columns: [
          'COLOR_YUV2RGBA_NV12',
          (cv.COLOR_YUV2RGBA_NV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_NV12 || '',
        columns: [
          'COLOR_YUV2BGRA_NV12',
          (cv.COLOR_YUV2BGRA_NV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_NV21 || '',
        columns: [
          'COLOR_YUV2RGBA_NV21',
          (cv.COLOR_YUV2RGBA_NV21 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_NV21 || '',
        columns: [
          'COLOR_YUV2BGRA_NV21',
          (cv.COLOR_YUV2BGRA_NV21 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420sp2RGBA || '',
        columns: [
          'COLOR_YUV420sp2RGBA',
          (cv.COLOR_YUV420sp2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420sp2BGRA || '',
        columns: [
          'COLOR_YUV420sp2BGRA',
          (cv.COLOR_YUV420sp2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_YV12 || '',
        columns: [
          'COLOR_YUV2RGB_YV12',
          (cv.COLOR_YUV2RGB_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_YV12 || '',
        columns: [
          'COLOR_YUV2BGR_YV12',
          (cv.COLOR_YUV2BGR_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_IYUV || '',
        columns: [
          'COLOR_YUV2RGB_IYUV',
          (cv.COLOR_YUV2RGB_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_IYUV || '',
        columns: [
          'COLOR_YUV2BGR_IYUV',
          (cv.COLOR_YUV2BGR_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_I420 || '',
        columns: [
          'COLOR_YUV2RGB_I420',
          (cv.COLOR_YUV2RGB_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_I420 || '',
        columns: [
          'COLOR_YUV2BGR_I420',
          (cv.COLOR_YUV2BGR_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420p2RGB || '',
        columns: ['COLOR_YUV420p2RGB', (cv.COLOR_YUV420p2RGB || '').toString()],
      },
      {
        value: cv.COLOR_YUV420p2BGR || '',
        columns: ['COLOR_YUV420p2BGR', (cv.COLOR_YUV420p2BGR || '').toString()],
      },
      {
        value: cv.COLOR_YUV2RGBA_YV12 || '',
        columns: [
          'COLOR_YUV2RGBA_YV12',
          (cv.COLOR_YUV2RGBA_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_YV12 || '',
        columns: [
          'COLOR_YUV2BGRA_YV12',
          (cv.COLOR_YUV2BGRA_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_IYUV || '',
        columns: [
          'COLOR_YUV2RGBA_IYUV',
          (cv.COLOR_YUV2RGBA_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_IYUV || '',
        columns: [
          'COLOR_YUV2BGRA_IYUV',
          (cv.COLOR_YUV2BGRA_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_I420 || '',
        columns: [
          'COLOR_YUV2RGBA_I420',
          (cv.COLOR_YUV2RGBA_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_I420 || '',
        columns: [
          'COLOR_YUV2BGRA_I420',
          (cv.COLOR_YUV2BGRA_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420p2RGBA || '',
        columns: [
          'COLOR_YUV420p2RGBA',
          (cv.COLOR_YUV420p2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420p2BGRA || '',
        columns: [
          'COLOR_YUV420p2BGRA',
          (cv.COLOR_YUV420p2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_420 || '',
        columns: [
          'COLOR_YUV2GRAY_420',
          (cv.COLOR_YUV2GRAY_420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_NV21 || '',
        columns: [
          'COLOR_YUV2GRAY_NV21',
          (cv.COLOR_YUV2GRAY_NV21 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_NV12 || '',
        columns: [
          'COLOR_YUV2GRAY_NV12',
          (cv.COLOR_YUV2GRAY_NV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_YV12 || '',
        columns: [
          'COLOR_YUV2GRAY_YV12',
          (cv.COLOR_YUV2GRAY_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_IYUV || '',
        columns: [
          'COLOR_YUV2GRAY_IYUV',
          (cv.COLOR_YUV2GRAY_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_I420 || '',
        columns: [
          'COLOR_YUV2GRAY_I420',
          (cv.COLOR_YUV2GRAY_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420sp2GRAY || '',
        columns: [
          'COLOR_YUV420sp2GRAY',
          (cv.COLOR_YUV420sp2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV420p2GRAY || '',
        columns: [
          'COLOR_YUV420p2GRAY',
          (cv.COLOR_YUV420p2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_UYVY || '',
        columns: [
          'COLOR_YUV2RGB_UYVY',
          (cv.COLOR_YUV2RGB_UYVY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_UYVY || '',
        columns: [
          'COLOR_YUV2BGR_UYVY',
          (cv.COLOR_YUV2BGR_UYVY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_Y422 || '',
        columns: [
          'COLOR_YUV2RGB_Y422',
          (cv.COLOR_YUV2RGB_Y422 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_Y422 || '',
        columns: [
          'COLOR_YUV2BGR_Y422',
          (cv.COLOR_YUV2BGR_Y422 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_UYNV || '',
        columns: [
          'COLOR_YUV2RGB_UYNV',
          (cv.COLOR_YUV2RGB_UYNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_UYNV || '',
        columns: [
          'COLOR_YUV2BGR_UYNV',
          (cv.COLOR_YUV2BGR_UYNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_UYVY || '',
        columns: [
          'COLOR_YUV2RGBA_UYVY',
          (cv.COLOR_YUV2RGBA_UYVY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_UYVY || '',
        columns: [
          'COLOR_YUV2BGRA_UYVY',
          (cv.COLOR_YUV2BGRA_UYVY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_Y422 || '',
        columns: [
          'COLOR_YUV2RGBA_Y422',
          (cv.COLOR_YUV2RGBA_Y422 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_Y422 || '',
        columns: [
          'COLOR_YUV2BGRA_Y422',
          (cv.COLOR_YUV2BGRA_Y422 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_UYNV || '',
        columns: [
          'COLOR_YUV2RGBA_UYNV',
          (cv.COLOR_YUV2RGBA_UYNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_UYNV || '',
        columns: [
          'COLOR_YUV2BGRA_UYNV',
          (cv.COLOR_YUV2BGRA_UYNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_YUY2 || '',
        columns: [
          'COLOR_YUV2RGB_YUY2',
          (cv.COLOR_YUV2RGB_YUY2 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_YUY2 || '',
        columns: [
          'COLOR_YUV2BGR_YUY2',
          (cv.COLOR_YUV2BGR_YUY2 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_YVYU || '',
        columns: [
          'COLOR_YUV2RGB_YVYU',
          (cv.COLOR_YUV2RGB_YVYU || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_YVYU || '',
        columns: [
          'COLOR_YUV2BGR_YVYU',
          (cv.COLOR_YUV2BGR_YVYU || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_YUYV || '',
        columns: [
          'COLOR_YUV2RGB_YUYV',
          (cv.COLOR_YUV2RGB_YUYV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_YUYV || '',
        columns: [
          'COLOR_YUV2BGR_YUYV',
          (cv.COLOR_YUV2BGR_YUYV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGB_YUNV || '',
        columns: [
          'COLOR_YUV2RGB_YUNV',
          (cv.COLOR_YUV2RGB_YUNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGR_YUNV || '',
        columns: [
          'COLOR_YUV2BGR_YUNV',
          (cv.COLOR_YUV2BGR_YUNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_YUY2 || '',
        columns: [
          'COLOR_YUV2RGBA_YUY2',
          (cv.COLOR_YUV2RGBA_YUY2 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_YUY2 || '',
        columns: [
          'COLOR_YUV2BGRA_YUY2',
          (cv.COLOR_YUV2BGRA_YUY2 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_YVYU || '',
        columns: [
          'COLOR_YUV2RGBA_YVYU',
          (cv.COLOR_YUV2RGBA_YVYU || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_YVYU || '',
        columns: [
          'COLOR_YUV2BGRA_YVYU',
          (cv.COLOR_YUV2BGRA_YVYU || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_YUYV || '',
        columns: [
          'COLOR_YUV2RGBA_YUYV',
          (cv.COLOR_YUV2RGBA_YUYV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_YUYV || '',
        columns: [
          'COLOR_YUV2BGRA_YUYV',
          (cv.COLOR_YUV2BGRA_YUYV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2RGBA_YUNV || '',
        columns: [
          'COLOR_YUV2RGBA_YUNV',
          (cv.COLOR_YUV2RGBA_YUNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2BGRA_YUNV || '',
        columns: [
          'COLOR_YUV2BGRA_YUNV',
          (cv.COLOR_YUV2BGRA_YUNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_UYVY || '',
        columns: [
          'COLOR_YUV2GRAY_UYVY',
          (cv.COLOR_YUV2GRAY_UYVY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_YUY2 || '',
        columns: [
          'COLOR_YUV2GRAY_YUY2',
          (cv.COLOR_YUV2GRAY_YUY2 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_Y422 || '',
        columns: [
          'COLOR_YUV2GRAY_Y422',
          (cv.COLOR_YUV2GRAY_Y422 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_UYNV || '',
        columns: [
          'COLOR_YUV2GRAY_UYNV',
          (cv.COLOR_YUV2GRAY_UYNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_YVYU || '',
        columns: [
          'COLOR_YUV2GRAY_YVYU',
          (cv.COLOR_YUV2GRAY_YVYU || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_YUYV || '',
        columns: [
          'COLOR_YUV2GRAY_YUYV',
          (cv.COLOR_YUV2GRAY_YUYV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_YUV2GRAY_YUNV || '',
        columns: [
          'COLOR_YUV2GRAY_YUNV',
          (cv.COLOR_YUV2GRAY_YUNV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGBA2mRGBA || '',
        columns: ['COLOR_RGBA2mRGBA', (cv.COLOR_RGBA2mRGBA || '').toString()],
      },
      {
        value: cv.COLOR_mRGBA2RGBA || '',
        columns: ['COLOR_mRGBA2RGBA', (cv.COLOR_mRGBA2RGBA || '').toString()],
      },
      {
        value: cv.COLOR_RGB2YUV_I420 || '',
        columns: [
          'COLOR_RGB2YUV_I420',
          (cv.COLOR_RGB2YUV_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGR2YUV_I420 || '',
        columns: [
          'COLOR_BGR2YUV_I420',
          (cv.COLOR_BGR2YUV_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGB2YUV_IYUV || '',
        columns: [
          'COLOR_RGB2YUV_IYUV',
          (cv.COLOR_RGB2YUV_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGR2YUV_IYUV || '',
        columns: [
          'COLOR_BGR2YUV_IYUV',
          (cv.COLOR_BGR2YUV_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGBA2YUV_I420 || '',
        columns: [
          'COLOR_RGBA2YUV_I420',
          (cv.COLOR_RGBA2YUV_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGRA2YUV_I420 || '',
        columns: [
          'COLOR_BGRA2YUV_I420',
          (cv.COLOR_BGRA2YUV_I420 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGBA2YUV_IYUV || '',
        columns: [
          'COLOR_RGBA2YUV_IYUV',
          (cv.COLOR_RGBA2YUV_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGRA2YUV_IYUV || '',
        columns: [
          'COLOR_BGRA2YUV_IYUV',
          (cv.COLOR_BGRA2YUV_IYUV || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGB2YUV_YV12 || '',
        columns: [
          'COLOR_RGB2YUV_YV12',
          (cv.COLOR_RGB2YUV_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGR2YUV_YV12 || '',
        columns: [
          'COLOR_BGR2YUV_YV12',
          (cv.COLOR_BGR2YUV_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_RGBA2YUV_YV12 || '',
        columns: [
          'COLOR_RGBA2YUV_YV12',
          (cv.COLOR_RGBA2YUV_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BGRA2YUV_YV12 || '',
        columns: [
          'COLOR_BGRA2YUV_YV12',
          (cv.COLOR_BGRA2YUV_YV12 || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2BGR || '',
        columns: ['COLOR_BayerBG2BGR', (cv.COLOR_BayerBG2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BayerGB2BGR || '',
        columns: ['COLOR_BayerGB2BGR', (cv.COLOR_BayerGB2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BayerRG2BGR || '',
        columns: ['COLOR_BayerRG2BGR', (cv.COLOR_BayerRG2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BayerGR2BGR || '',
        columns: ['COLOR_BayerGR2BGR', (cv.COLOR_BayerGR2BGR || '').toString()],
      },
      {
        value: cv.COLOR_BayerBG2RGB || '',
        columns: ['COLOR_BayerBG2RGB', (cv.COLOR_BayerBG2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BayerGB2RGB || '',
        columns: ['COLOR_BayerGB2RGB', (cv.COLOR_BayerGB2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BayerRG2RGB || '',
        columns: ['COLOR_BayerRG2RGB', (cv.COLOR_BayerRG2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BayerGR2RGB || '',
        columns: ['COLOR_BayerGR2RGB', (cv.COLOR_BayerGR2RGB || '').toString()],
      },
      {
        value: cv.COLOR_BayerBG2GRAY || '',
        columns: [
          'COLOR_BayerBG2GRAY',
          (cv.COLOR_BayerBG2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2GRAY || '',
        columns: [
          'COLOR_BayerGB2GRAY',
          (cv.COLOR_BayerGB2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2GRAY || '',
        columns: [
          'COLOR_BayerRG2GRAY',
          (cv.COLOR_BayerRG2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2GRAY || '',
        columns: [
          'COLOR_BayerGR2GRAY',
          (cv.COLOR_BayerGR2GRAY || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2BGR_VNG || '',
        columns: [
          'COLOR_BayerBG2BGR_VNG',
          (cv.COLOR_BayerBG2BGR_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2BGR_VNG || '',
        columns: [
          'COLOR_BayerGB2BGR_VNG',
          (cv.COLOR_BayerGB2BGR_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2BGR_VNG || '',
        columns: [
          'COLOR_BayerRG2BGR_VNG',
          (cv.COLOR_BayerRG2BGR_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2BGR_VNG || '',
        columns: [
          'COLOR_BayerGR2BGR_VNG',
          (cv.COLOR_BayerGR2BGR_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2RGB_VNG || '',
        columns: [
          'COLOR_BayerBG2RGB_VNG',
          (cv.COLOR_BayerBG2RGB_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2RGB_VNG || '',
        columns: [
          'COLOR_BayerGB2RGB_VNG',
          (cv.COLOR_BayerGB2RGB_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2RGB_VNG || '',
        columns: [
          'COLOR_BayerRG2RGB_VNG',
          (cv.COLOR_BayerRG2RGB_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2RGB_VNG || '',
        columns: [
          'COLOR_BayerGR2RGB_VNG',
          (cv.COLOR_BayerGR2RGB_VNG || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2BGR_EA || '',
        columns: [
          'COLOR_BayerBG2BGR_EA',
          (cv.COLOR_BayerBG2BGR_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2BGR_EA || '',
        columns: [
          'COLOR_BayerGB2BGR_EA',
          (cv.COLOR_BayerGB2BGR_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2BGR_EA || '',
        columns: [
          'COLOR_BayerRG2BGR_EA',
          (cv.COLOR_BayerRG2BGR_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2BGR_EA || '',
        columns: [
          'COLOR_BayerGR2BGR_EA',
          (cv.COLOR_BayerGR2BGR_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2RGB_EA || '',
        columns: [
          'COLOR_BayerBG2RGB_EA',
          (cv.COLOR_BayerBG2RGB_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2RGB_EA || '',
        columns: [
          'COLOR_BayerGB2RGB_EA',
          (cv.COLOR_BayerGB2RGB_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2RGB_EA || '',
        columns: [
          'COLOR_BayerRG2RGB_EA',
          (cv.COLOR_BayerRG2RGB_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2RGB_EA || '',
        columns: [
          'COLOR_BayerGR2RGB_EA',
          (cv.COLOR_BayerGR2RGB_EA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2BGRA || '',
        columns: [
          'COLOR_BayerBG2BGRA',
          (cv.COLOR_BayerBG2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2BGRA || '',
        columns: [
          'COLOR_BayerGB2BGRA',
          (cv.COLOR_BayerGB2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2BGRA || '',
        columns: [
          'COLOR_BayerRG2BGRA',
          (cv.COLOR_BayerRG2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2BGRA || '',
        columns: [
          'COLOR_BayerGR2BGRA',
          (cv.COLOR_BayerGR2BGRA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerBG2RGBA || '',
        columns: [
          'COLOR_BayerBG2RGBA',
          (cv.COLOR_BayerBG2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGB2RGBA || '',
        columns: [
          'COLOR_BayerGB2RGBA',
          (cv.COLOR_BayerGB2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerRG2RGBA || '',
        columns: [
          'COLOR_BayerRG2RGBA',
          (cv.COLOR_BayerRG2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLOR_BayerGR2RGBA || '',
        columns: [
          'COLOR_BayerGR2RGBA',
          (cv.COLOR_BayerGR2RGBA || '').toString(),
        ],
      },
      {
        value: cv.COLORCOLORCVT_MAX || '',
        columns: ['COLORCOLORCVT_MAX', (cv.COLORCOLORCVT_MAX || '').toString()],
      },
    ];
  }
}
