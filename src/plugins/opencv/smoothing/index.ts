import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Point, Mat, Size } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from 'renderer/contexts/GCStore';

const tabName = 'Smoothing';

/**
 * MedianBlur component and node
 */
export class MedianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Median' };
  static processor = class MedianBlurNode extends CVFNodeProcessor {
    static properties = [{ name: 'kSize', type: PropertyType.Integer }];

    kSize: number = 3;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.medianBlur(src, out, this.kSize);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * GaussianBlur component and node
 */
export class GaussianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Gaussian' };
  static processor = class GaussianBlurNode extends CVFNodeProcessor {
    static properties = [
      { name: 'size', type: PropertyType.Size },
      { name: 'sigmaX', type: PropertyType.Decimal },
      { name: 'sigmaY', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    size: Size = new cv.Size(3, 3);
    sigmaX: number = 1;
    sigmaY: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.GaussianBlur(
            src,
            out,
            this.size,
            this.sigmaX,
            this.sigmaY,
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
 * Blur component and node
 */
export class BlurComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Blur' };
  static processor = class BlurNode extends CVFNodeProcessor {
    static properties = [
      { name: 'ksize', type: PropertyType.Size },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.blur(src, out, this.ksize, this.anchor, this.borderType);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Filter2D component and node
 */
export class Filter2DComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Filter2D' };
  static processor = class Filter2DNode extends CVFNodeProcessor {
    static properties = [
      { name: 'anchor', type: PropertyType.Point },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    anchor: Point = new cv.Point(-1, -1);
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_CONSTANT;

    async proccess() {
      let kernel: Mat | null = null;

      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!kernel?.rows) kernel = src.clone();
          else {
            const out = new cv.Mat(src.rows, src.cols, src.type());
            GCStore.add(out);

            cv.filter2D(
              src,
              out,
              -1,
              kernel!,
              this.anchor,
              this.delta,
              this.borderType
            );
            this.sources.push(out);
            this.output(out);
          }
        }
      }
    }
  };
}

/**
 * BilateralFilter component and node
 */
export class BilateralFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Bilateral' };
  static processor = class BilateralFilterNode extends CVFNodeProcessor {
    static properties = [
      { name: 'd', type: PropertyType.Integer },
      { name: 'sigmaColor', type: PropertyType.Decimal },
      { name: 'sigmaSpace', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    d: number = 1;
    sigmaColor: number = 1;
    sigmaSpace: number = 1;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.bilateralFilter(
            src,
            out,
            this.d,
            this.sigmaColor,
            this.sigmaSpace,
            this.borderType
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
