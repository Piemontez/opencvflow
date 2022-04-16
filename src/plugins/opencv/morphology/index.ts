import { CVFComponent, CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Scalar, Point, Mat } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from 'renderer/contexts/GCStore';
import { MorphTypes } from 'opencv-ts/src/ImageProcessing/ImageFiltering';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { Position } from 'react-flow-renderer/nocss';

const tabName = 'Morphology';

/**
 * Erode component and node
 */
export class ErodeComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Erode' };
  static processor = class ErodeNode extends CVFNodeProcessor {
    static properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];
    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.erode(
            src,
            out,
            this.kernel,
            this.anchor,
            this.iterations,
            this.borderType,
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
 * Dilate component and node
 */
export class DilateComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Dilate' };
  static processor = class DilateNode extends CVFNodeProcessor {
    static properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.dilate(
            src,
            out,
            this.kernel,
            this.anchor,
            this.iterations,
            this.borderType,
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
 * Opening component and node
 */
export class OpeningComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Opening' };
  static processor = class OpeningNode extends CVFNodeProcessor {
    static properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.morphologyEx(
            src,
            out,
            cv.MORPH_OPEN,
            this.kernel,
            this.anchor,
            this.iterations,
            this.borderType,
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
 * Closing component and node
 */
export class ClosingComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Closing' };
  static processor = class ClosingNode extends CVFNodeProcessor {
    static properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(
      cv.MORPH_RECT,
      new cv.Size(3, 3),
      new cv.Point(-1, -1)
    );
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.morphologyEx(
            src,
            out,
            cv.MORPH_CLOSE,
            this.kernel,
            this.anchor,
            this.iterations,
            this.borderType,
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
 * MorphologyEx component and node
 */
export class MorphologyExComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Morphology Ex' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class MorphologyExNode extends CVFNodeProcessor {
    static properties = [
      { name: 'op', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    op: MorphTypes = cv.MORPH_OPEN;
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      this.sources = [];
      if (inputs.length === 2) {
        const [src, kernel] = inputs;

        if (src && kernel) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.morphologyEx(
            src,
            out,
            this.op,
            kernel,
            this.anchor,
            this.iterations,
            this.borderType,
            this.borderValue
          );
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
