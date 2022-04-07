import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from 'renderer/contexts/GCStore';

const tabName = 'Edge';

/**
 * Sobel component and node
 */
export class CVSobelComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Sobel' };

  static processor = class SobelProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'dDepth', type: PropertyType.Integer },
      { name: 'dX', type: PropertyType.Integer },
      { name: 'dY', type: PropertyType.Integer },
      { name: 'kSize', type: PropertyType.Integer },
      { name: 'scale', type: PropertyType.Decimal },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    dDepth: number = cv.CV_8U;
    dX: number = 1;
    dY: number = 0;
    kSize: number = 3;
    scale: number = 1;
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);
          GCStore.add(out);

          cv.Sobel(
            src,
            out,
            this.dDepth,
            this.dX,
            this.dY,
            this.kSize,
            this.scale,
            this.delta,
            this.borderType
          );

          this.sources.push(out);

          this.output(out);
        }
      }
    }
  };
}

/**
 * Canny component and node
 */
export class CannyComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Canny' };
  static processor = class CannyNode extends CVFNodeProcessor {
    static properties = [
      { name: 'tthreshold1', type: PropertyType.Decimal },
      { name: 'threshold2', type: PropertyType.Decimal },
      { name: 'aperturesize', type: PropertyType.Integer },
      { name: 'l2gradiente', type: PropertyType.Boolean },
    ];

    tthreshold1: number = 80;
    threshold2: number = 170;
    aperturesize: number = 3;
    l2gradiente: boolean = false;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.Canny(
            src,
            out,
            this.tthreshold1,
            this.tthreshold1
            // this.aperturesize, TODO: opencv-ts ainda não recebe este
            // this.L2gradiente, TODO: opencv-ts ainda não recebe este
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Laplacian component and node
 */
export class LaplacianComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Laplacian' };
  static processor = class LaplacianNode extends CVFNodeProcessor {
    static properties = [
      { name: 'dDepth', type: PropertyType.Integer },
      { name: 'kSize', type: PropertyType.Integer },
      { name: 'scale', type: PropertyType.Decimal },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    dDepth: number = cv.CV_8U;
    kSize: number = 3;
    scale: number = 1;
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.Laplacian(
            src,
            out,
            this.dDepth,
            this.kSize,
            this.scale,
            this.delta,
            this.borderType
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
