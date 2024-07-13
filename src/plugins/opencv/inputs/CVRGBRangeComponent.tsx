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
export class CVRGBRangeComponent extends CVFComponent {
  static menu = {
    tabTitle: inputTabName,
    title: 'RGB Range',
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
      { name: 'redMin', type: PropertyType.IntegerRange, min: 0, max: 255 },
      { name: 'redMax', type: PropertyType.IntegerRange, min: 0, max: 255 },
      { name: 'greenMin', type: PropertyType.IntegerRange, min: 0, max: 255 },
      { name: 'greenMax', type: PropertyType.IntegerRange, min: 0, max: 255 },
      { name: 'blueMin', type: PropertyType.IntegerRange, min: 0, max: 255 },
      { name: 'blueMax', type: PropertyType.IntegerRange, min: 0, max: 255 },
    ];

    redMin: number = 0;
    redMax: number = 255;
    greenMin: number = 0;
    greenMax: number = 255;
    blueMin: number = 0;
    blueMax: number = 255;

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
      if (name === 'redMin' && value > this.redMax) this.redMax = value;
      if (name === 'redMax' && value < this.redMin) this.redMin = value;
      if (name === 'greenMin' && value > this.greenMax) this.greenMax = value;
      if (name === 'greenMax' && value < this.greenMin) this.greenMin = value;
      if (name === 'blueMin' && value > this.blueMax) this.blueMax = value;
      if (name === 'blueMax' && value < this.blueMin) this.blueMin = value;
    }

    repaintCanvas() {
      const topCTX = this.canvas?.getContext('2d');
      const botCTX = this.canvasEnd?.getContext('2d');
      if (!topCTX || !botCTX) {
        return;
      }

      topCTX.clearRect(0, 0, this.canvas!.width, this.canvas!.height);
      topCTX.clearRect(0, 0, this.canvasEnd!.width, this.canvasEnd!.height);

      const rgb = GCStore.add(new cv.Mat(1, 1, cv.CV_8UC3));

      let wSize;
      const hSize = this.canvas!.height / (this.greenMax - this.greenMin);
      const hueMinMax = [];

      if (this.redMin <= this.redMax) {
        wSize = this.canvas!.width / (this.redMax - this.redMin);
        hueMinMax.push([this.redMin, this.redMax]);
      } else {
        wSize = this.canvas!.width / (this.redMax + (OPENCV_HSV_H_MAXVALUE - this.redMin));
        hueMinMax.push([0, this.redMax]);
        hueMinMax.push([this.redMin, OPENCV_HSV_H_MAXVALUE]);
      }

      let x = 0;
      for (let [hMin, hMax] of hueMinMax) {
        for (let r = hMin; r <= hMax; r++, x++) {
          let y = 0;
          for (let g = this.greenMin; g <= this.greenMax; g++, y++) {
            rgb.ucharPtr(0, 0)[0] = r;
            rgb.ucharPtr(0, 0)[1] = g;

            rgb.ucharPtr(0, 0)[2] = this.blueMin;
            this.fillCanvasColor(rgb, topCTX, x * wSize, y * hSize, wSize, hSize);

            rgb.ucharPtr(0, 0)[2] = this.blueMax;
            this.fillCanvasColor(rgb, botCTX, x * wSize, y * hSize, wSize, hSize);
          }
        }
      }
    }

    fillCanvasColor(rgb: Mat, ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
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
      this.min = new cv.Mat(rows, cols, type || cv.CV_8UC3, new cv.Scalar(this.redMin, this.greenMin, this.blueMin));
      this.max = new cv.Mat(rows, cols, type || cv.CV_8UC3, new cv.Scalar(this.redMax, this.greenMax, this.blueMax));

      GCStore.add(this.min);
      GCStore.add(this.max);
    }
  };
}
