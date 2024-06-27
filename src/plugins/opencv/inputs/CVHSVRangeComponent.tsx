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
import { OPENCV_HSV_H_MAXVALUE } from '../../../ide/commons/consts';

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
    saturationMax: number = 255;
    valueMin: number = 0;
    valueMax: number = 255;

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
      if (value > OPENCV_HSV_H_MAXVALUE) {
        if (name === 'hueMin') this.hueMin = OPENCV_HSV_H_MAXVALUE;
        if (name === 'hueMax') this.hueMax = OPENCV_HSV_H_MAXVALUE;
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
      const topCTX = this.canvas?.getContext('2d');
      const botCTX = this.canvasEnd?.getContext('2d');
      if (!topCTX || !botCTX) {
        return;
      }

      const hsv = GCStore.add(new cv.Mat(1, 1, cv.CV_8UC3));
      const rgb = GCStore.add(new cv.Mat());

      let wSize;
      const hSize = this.canvas!.height / (this.saturationMax - this.saturationMin);
      const hueMinMax = [];

      if (this.hueMin <= this.hueMax) {
        wSize = this.canvas!.width / (this.hueMax - this.hueMin);
        hueMinMax.push([this.hueMin, this.hueMax]);
      } else {
        wSize = this.canvas!.width / (this.hueMax + (OPENCV_HSV_H_MAXVALUE - this.hueMin));
        hueMinMax.push([0, this.hueMax]);
        hueMinMax.push([this.hueMin, OPENCV_HSV_H_MAXVALUE]);
      }

      let x = 0;
      for (let [hMin, hMax] of hueMinMax) {
        for (let h = hMin; h <= hMax; h++, x++) {
          let y = 0;
          for (let s = this.saturationMin; s <= this.saturationMax; s++, y++) {
            hsv.ucharPtr(0, 0)[0] = h;
            hsv.ucharPtr(0, 0)[1] = s;

            hsv.ucharPtr(0, 0)[2] = this.valueMin;
            this.fillCanvasColor(hsv, rgb, topCTX, x * wSize, y * hSize, wSize, hSize);

            hsv.ucharPtr(0, 0)[2] = this.valueMax;
            this.fillCanvasColor(hsv, rgb, botCTX, x * wSize, y * hSize, wSize, hSize);
          }
        }
      }
    }

    fillCanvasColor(hsv: Mat, rgb: Mat, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
      cv.cvtColor(hsv, rgb, cv.COLOR_HSV2RGB);
      const [r, g, b] = rgb.data;
      const hex = '#' + rgb2Hex(r, g, b);

      ctx.strokeStyle = hex;
      ctx.fillStyle = hex;
      ctx.fillRect(x, y, w, h);
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
