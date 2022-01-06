import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Scalar, Point, Mat, Size } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';

const tabName = 'ImgProc';

/**
 * Sobel component and node
 */
export class CVSobelComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Sobel' };

  static processor = class SobelProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'DDepth', type: PropertyType.Integer },
      { name: 'DX', type: PropertyType.Integer },
      { name: 'DY', type: PropertyType.Integer },
      { name: 'KSize', type: PropertyType.Integer },
      { name: 'Scale', type: PropertyType.Decimal },
      { name: 'Delta', type: PropertyType.Decimal },
      { name: 'BorderType', type: PropertyType.BorderType },
    ];

    DDepth: number = cv.CV_8U;
    DX: number = 1;
    DY: number = 0;
    KSize: number = 3;
    Scale: number = 1;
    Delta: number = 0;
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const dst = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);

          cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
          cv.Sobel(
            src,
            dst,
            this.DDepth,
            this.DX,
            this.DY,
            this.KSize,
            this.Scale,
            this.Delta,
            this.BorderType
          );

          this.sources.push(dst);

          this.output(dst);
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
    threshold1: number = 80; //double
    threshold2: number = 170; //double
    aperturesize: number = 3; //int
    L2gradiente: boolean = false; //bool

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.Canny(
            src,
            out,
            this.threshold1,
            this.threshold1
            //this.aperturesize, TODO: opencv-ts ainda não recebe este
            //this.L2gradiente, TODO: opencv-ts ainda não recebe este
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
    ddepth: number = cv.CV_8U; //int
    ksize: number = 3; //int
    scale: number = 1; //double
    delta: number = 0; //double
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.Laplacian(
            src,
            out,
            this.ddepth,
            this.ksize,
            this.scale,
            this.delta,
            this.BorderType
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * MedianBlur component and node
 */
export class MedianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Median' };
  static processor = class MedianBlurNode extends CVFNodeProcessor {
    ksize: number = 3; //int

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.medianBlur(src, out, this.ksize);
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
    size: Size = new cv.Size(3, 3);
    sigmaX: number = 1; //double
    sigmaY: number = 0; //double
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
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
            this.BorderType
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
    d: number = 1; //int
    sigmaColor: number = 1; //double
    sigmaSpace: number = 1; //double
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
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
            this.BorderType
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
    ddepth: number = -1; //int
    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    normalize: boolean = true;
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
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
            this.BorderType
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
    ddepth: number = -1; //int
    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    normalize: boolean = true;
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
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
            this.BorderType
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
    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.blur(src, out, this.ksize, this.anchor, this.BorderType);
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
    ddepth: number = -1; //int
    dx: number = 1; //int
    dy: number = 0; //int
    scale: number = 1; //double
    delta: number = 0; //double
    BorderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
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
            this.BorderType
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Dilate component and node
 */
export class DilateComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Dilate' };
  static processor = class DilateNode extends CVFNodeProcessor {
    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_ELLIPSE,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1; //int
    BorderType: BorderTypes = cv.BORDER_CONSTANT; //int
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.dilate(
            src,
            out,
            this.kernel,
            this.anchor,
            this.iterations,
            this.BorderType,
            this.borderValue
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Erode component and node
 */
export class ErodeComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Erode' };
  static processor = class ErodeNode extends CVFNodeProcessor {
    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_ELLIPSE,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1; //int
    BorderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          cv.erode(
            src,
            out,
            this.kernel,
            this.anchor,
            this.iterations,
            this.BorderType,
            this.borderValue
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
    code: number = cv.COLOR_BGR2GRAY; //int
    dstCn: number = 0; //int

    async proccess() {
      const inputs = this.inputs;
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
 * Filter2D component and node
 */
export class Filter2DComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Filter2D' };
  static processor = class Filter2DNode extends CVFNodeProcessor {
    Anchor: Point = new cv.Point(-1, -1);
    Delta: number = 0;
    BorderType: BorderTypes = cv.BORDER_CONSTANT;

    async proccess() {
      let kernel: Mat | null = null;

      const inputs = this.inputs;
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
              this.Anchor,
              this.Delta,
              this.BorderType
            );
            this.sources.push(out);
            this.output(out);
          }
        }
      }
    }
  };
}
