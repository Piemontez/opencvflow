import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Point, Mat, Size, BackgroundSubtractorMOG2 } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import { ColorConversionCodes } from 'opencv-ts/src/core/ColorConversion';
import * as segmentation from './segmentation';
import * as edge from './edge';
import * as morphology from './morphology';
import {
  DistanceTransformMasks,
  DistanceTypes,
} from 'opencv-ts/src/ImageProcessing/Misc';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';

export const ThresholdComponent = segmentation.ThresholdComponent;
export const ConnectedComponentsComponent =
  segmentation.ConnectedComponentsComponent;
export const WatershedComponent = segmentation.WatershedComponent;
export const CVSobelComponent = edge.CVSobelComponent;
export const CannyComponent = edge.CannyComponent;
export const LaplacianComponent = edge.LaplacianComponent;
export const DilateComponent = morphology.DilateComponent;
export const ErodeComponent = morphology.ErodeComponent;

const tabName = 'ImgProc';
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

/**
 * BoxFilter component and node
 */
export class BoxFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'BoxFilter' };
  static processor = class BoxFilterNode extends CVFNodeProcessor {
    static properties = [
      { name: 'ddepth', type: PropertyType.Integer },
      { name: 'ksize', type: PropertyType.Size },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'normalize', type: PropertyType.Boolean },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ddepth: number = -1;
    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    normalize: boolean = true;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.boxFilter(
            src,
            out,
            this.ddepth,
            this.ksize,
            this.anchor,
            this.normalize,
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
 * SqrBoxFilter component and node
 */
export class SqrBoxFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'SqrBox' };
  static processor = class SqrBoxFilterNode extends CVFNodeProcessor {
    static properties = [
      { name: 'ddepth', type: PropertyType.Integer },
      { name: 'ksize', type: PropertyType.Size },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'normalize', type: PropertyType.Boolean },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ddepth: number = -1;
    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    normalize: boolean = true;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.sqrBoxFilter(
            src,
            out,
            this.ddepth,
            this.ksize,
            this.anchor,
            this.normalize,
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
          cv.blur(src, out, this.ksize, this.anchor, this.borderType);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Scharr component and node
 */
export class ScharrComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Scharr' };
  static processor = class ScharrNode extends CVFNodeProcessor {
    static properties = [
      { name: 'ddepth', type: PropertyType.Integer },
      { name: 'dx', type: PropertyType.Integer },
      { name: 'dy', type: PropertyType.Integer },
      { name: 'scale', type: PropertyType.Decimal },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ddepth: number = -1;
    dx: number = 1;
    dy: number = 0;
    scale: number = 1;
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.Scharr(
            src,
            out,
            this.ddepth,
            this.dx,
            this.dy,
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
 * CvtColor component and node
 */
export class CvtColorComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'CvtColor' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    static properties = [
      { name: 'code', type: PropertyType.ColorConversionCodes },
      { name: 'dstCn', type: PropertyType.Integer },
    ];

    code: ColorConversionCodes = cv.COLOR_BGR2GRAY;
    dstCn: number = 0;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.cvtColor(src, out, this.code, this.dstCn);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * ConverTo component and node
 */
export class ConverToComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'ConverTo' };
  static processor = class ConverToNode extends CVFNodeProcessor {
    static properties = [
      { name: 'rtype', type: PropertyType.Integer },
      { name: 'alpha', type: PropertyType.Decimal },
      { name: 'beta', type: PropertyType.Decimal },
    ];

    rtype: DataTypes = cv.CV_8U;
    alpha: number = 1;
    beta: number = 0;

    async proccess() {
      const { inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          src.convertTo(out, this.rtype, this.alpha, this.beta);

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
 * BackgroundSubtractorMOG2 component and node
 */
export class BackgroundSubtractorMOG2Component extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'BGSubtractorMog2' };
  static processor = class MedianBlurNode extends CVFNodeProcessor {
    static properties = [
      { name: 'history', type: PropertyType.Integer },
      { name: 'varThreshold', type: PropertyType.Decimal },
      { name: 'detectShadows', type: PropertyType.Boolean },
    ];

    history: number = 500;
    varThreshold: number = 16;
    detectShadows: boolean = true;

    subtractor?: BackgroundSubtractorMOG2;
    fgmask?: Mat;

    async start() {
      this.subtractor = new cv.BackgroundSubtractorMOG2(
        this.history,
        this.varThreshold,
        this.detectShadows
      );
    }

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        inputs.forEach((src) => {
          if (!this.fgmask)
            this.fgmask = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);

          this.subtractor!.apply(src, this.fgmask);

          this.sources.push(this.fgmask);
          this.output(this.fgmask);
        });
      }
    }

    async stop() {
      this.fgmask?.delete();
      this.fgmask = undefined;
    }
  };
}

/**
 * Threshold component and node
 */
export class DistanceTransformComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Distance Transform' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    static properties = [
      { name: 'distanceType', type: PropertyType.DistanceTypes },
      { name: 'maskSize', type: PropertyType.DistanceTransformMasks },
    ];

    distanceType: DistanceTypes = cv.DIST_L2;
    maskSize: DistanceTransformMasks = cv.DIST_MASK_3;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.distanceTransform(src, out, this.distanceType, this.maskSize);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
