import { CVFComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { Position } from 'reactflow';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { inputTabName } from './tabname';
import { PropertyType } from '../../../ide/types/PropertyType';
import { NodeSizes } from '../../../core/config/sizes';
import { rgb2Hex } from '../../../core/utils/colors';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import GCStore from '../../../core/contexts/GCStore';

/**
 * Video Capture component and node
 */
export class CVHSVRangeComponent extends CVFComponent {
  static menu = {
    tabTitle: inputTabName,
    title: 'HSV Range',
  };

  targets: TargetHandle[] = [
    { title: 'rows', position: Position.Left },
    { title: 'cols', position: Position.Left },
    { title: 'type', position: Position.Left },
  ];

  sources: SourceHandle[] = [
    { title: 'min', position: Position.Right },
    { title: 'max', position: Position.Right },
  ];

  static processor = class HSVRangeProcessor extends CVFNodeProcessor {
    canvas: HTMLCanvasElement | null = null;
    canvasEnd: HTMLCanvasElement | null = null;

    properties = [
      { name: 'hueMin', type: PropertyType.Integer },
      { name: 'hueMax', type: PropertyType.Integer },
      { name: 'saturationMin', type: PropertyType.Integer },
      { name: 'saturationMax', type: PropertyType.Integer },
      { name: 'valueMin', type: PropertyType.Integer },
      { name: 'valueMax', type: PropertyType.Integer },
    ];

    hueMin: number = 0;
    hueMax: number = 359;
    saturationMin: number = 0;
    saturationMax: number = 100;
    valueMin: number = 20;
    valueMax: number = 80;

    min?: Mat;
    max?: Mat;

    body() {
      return (
        <>
          <canvas width={NodeSizes.defaultWidth * 0.6} height={NodeSizes.defaultHeight * 0.4} ref={(ref) => (this.canvas = ref)} />
          <br style={{ clear: 'both' }} />
          <canvas width={NodeSizes.defaultWidth * 0.6} height={NodeSizes.defaultHeight * 0.4} ref={(ref) => (this.canvasEnd = ref)} />
        </>
      );
    }

    async propertyChange(name: string, value: number): Promise<void> {
      this.validateFields(name, value);
      this.repaintCanvas();
    }

    validateFields(name: string, value: number) {
      if (value > 180) {
        if (name === 'hueMin') this.hueMin = 180;
        if (name === 'hueMax') this.hueMax = 180;
      }

      if (value < 0) {
        if (name === 'hueMin') this.hueMin = 0;
        if (name === 'hueMax') this.hueMax = 0;
        if (name === 'saturationMin') this.saturationMin = 0;
        if (name === 'saturationMax') this.saturationMax = 0;
        if (name === 'valueMin') this.valueMin = 0;
        if (name === 'valueMax') this.valueMax = 0;
      } else if (value > 255) {
        if (name === 'saturationMin') this.saturationMin = 255;
        if (name === 'saturationMax') this.saturationMax = 255;
        if (name === 'valueMin') this.valueMin = 255;
        if (name === 'valueMax') this.valueMax = 255;
      }
    }

    repaintCanvas() {
      const canvasCTX = this.canvas?.getContext('2d');
      const canvasEndCTX = this.canvasEnd?.getContext('2d');
      if (!canvasCTX || !canvasEndCTX) {
        return;
      }

      const wSize = this.canvas!.width / (this.hueMax - this.hueMin);
      const hSize = this.canvas!.height / (this.saturationMax - this.saturationMin);

      let x = 0;
      const hsv = GCStore.add(new cv.Mat(1, 1, cv.CV_8UC3));
      const rgb = GCStore.add(new cv.Mat());
      for (let h = this.hueMin; h <= this.hueMax; h++, x++) {
        let y = 0;
        for (let s = this.saturationMin; s <= this.saturationMax; s++, y++) {
          hsv.ucharPtr(0, 0)[0] = h;
          hsv.ucharPtr(0, 0)[1] = s;
          {
            // Min Value
            hsv.ucharPtr(0, 0)[2] = this.valueMin;
            cv.cvtColor(hsv, rgb, cv.COLOR_HSV2RGB);

            const [r, g, b] = rgb.data;
            const hex = '#' + rgb2Hex(r, g, b);
            canvasCTX.strokeStyle = hex;
            canvasCTX.fillStyle = hex;
            canvasCTX.fillRect(x * wSize, y * hSize, wSize, hSize);
          }

          {
            // Max value
            hsv.ucharPtr(0, 0)[2] = this.valueMax;
            cv.cvtColor(hsv, rgb, cv.COLOR_HSV2RGB);

            const [r, g, b] = rgb.data;
            const hex = '#' + rgb2Hex(r, g, b);
            canvasEndCTX.strokeStyle = hex;
            canvasEndCTX.fillStyle = hex;
            canvasEndCTX.fillRect(x * wSize, y * hSize, wSize, hSize);
          }
        }
      }
    }

    async start() {
      this.repaintCanvas();
    }

    async proccess() {
      const { inputs } = this;

      this.sources = [];
      if (inputs.length < 2) {
        return;
      }

      this.calculateMinMax(inputs[0] as number, inputs[1] as number, inputs[2] as DataTypes);

      if (this.min) {
        this.sources.push(this.min);
      }
      if (this.max) {
        this.sources.push(this.max);
      }
    }

    calculateMinMax(rows: number, cols: number, type: DataTypes) {
      this.min = new cv.Mat(rows, cols, type || cv.CV_8UC3, new cv.Scalar(this.hueMin, this.saturationMin, this.valueMin));
      this.max = new cv.Mat(rows, cols, type || cv.CV_8UC3, new cv.Scalar(this.hueMax, this.saturationMax, this.valueMax));

      GCStore.add(this.min);
      GCStore.add(this.max);
    }
  };
}
