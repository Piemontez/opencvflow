import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Point, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';

const tabName = 'Smoothing';

/**
 * MedianBlur component and node
 */
export class MedianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Median' };
  static processor = class MedianBlurNode extends CVFNodeProcessor {
    properties = [{ name: 'kSize', type: PropertyType.Integer }];

    kSize: number = 3;

    async proccess() {
      const { inputsAsMat: inputs } = this;
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
    properties = [
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
      const { inputsAsMat: inputs } = this;
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
    properties = [
      { name: 'ksize', type: PropertyType.Size },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
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
 * BilateralFilter component and node
 */
export class BilateralFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Bilateral' };
  static processor = class BilateralFilterNode extends CVFNodeProcessor {
    properties = [
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
      const { inputsAsMat: inputs } = this;
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


/**
 * BoxFilter component and node
 */
 export class BoxFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'BoxFilter' };
  static processor = class BoxFilterNode extends CVFNodeProcessor {
    properties = [
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
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

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
    properties = [
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
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

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
 * Filter2D component and node
 */
export class Filter2DComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Filter2D' };
  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class Filter2DNode extends CVFNodeProcessor {
    properties = [
      { name: 'ddepth', type: PropertyType.Integer },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ddepth: number = -1;
    anchor: Point = new cv.Point(-1, -1);
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_CONSTANT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length === 2) {
        this.sources = [];
        const [src, kernel] = inputs;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        // Não é do mesmo tipo independente da quantidade de canais
        if (!((1 | 2 | 4) & kernel.type() & src.type())) {
          // Converte para o mesmo tipo porém com 1 canal só
          kernel.convertTo(kernel, src.type() & (1 | 2 | 4));
        }

        cv.filter2D(
          src,
          out,
          this.ddepth,
          kernel,
          this.anchor,
          this.delta,
          this.borderType
        );
        this.sources.push(out);
        this.output(out);
      }
    }
  };
}
