import { CVFComponent, CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Scalar, Point, Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { MorphTypes } from 'opencv-ts/src/ImageProcessing/ImageFiltering';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';

const tabName = ['OpenCV', 'Morphology'];

/**
 * Erode component and node
 */
export class ErodeComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Erode' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];

  static processor = class ErodeNode extends CVFNodeProcessor {
    properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];
    kernel: Mat = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3), new cv.Point(-1, -1));
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        const [src, kernel] = inputs;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        cv.erode(src, out, kernel || this.kernel, this.anchor, this.iterations, this.borderType, this.borderValue);

        this.sources = [out];
        this.output(out);
      } else {
        this.sources = [];
      }
    }
  };
}

/**
 * Dilate component and node
 */
export class DilateComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Dilate' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];

  static processor = class DilateNode extends CVFNodeProcessor {
    properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3), new cv.Point(-1, -1));
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        const [src, kernel] = inputs;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        cv.dilate(src, out, kernel || this.kernel, this.anchor, this.iterations, this.borderType, this.borderValue);
        this.sources = [out];
        this.output(out);
      } else {
        this.sources = [];
      }
    }
  };
}

/**
 * Opening component and node
 */
export class OpeningComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Opening' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];

  static processor = class OpeningNode extends CVFNodeProcessor {
    properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3), new cv.Point(-1, -1));
    anchor: Point = new cv.Point(-1, -1);
    iterations: number = 1;
    borderType: BorderTypes = cv.BORDER_CONSTANT;
    borderValue: Scalar = cv.morphologyDefaultBorderValue();

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        const [src, kernel] = inputs;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        cv.morphologyEx(src, out, cv.MORPH_OPEN, kernel || this.kernel, this.anchor, this.iterations, this.borderType, this.borderValue);
        this.sources = [out];
        this.output(out);
      } else {
        this.sources = [];
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
    properties = [
      { name: 'kernel', type: PropertyType.OneZeroMatrix },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'iterations', type: PropertyType.Integer },
      { name: 'borderType', type: PropertyType.BorderType },
      { name: 'borderValue', type: PropertyType.Scalar },
    ];

    kernel: Mat = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3), new cv.Point(-1, -1));
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

          cv.morphologyEx(src, out, cv.MORPH_CLOSE, this.kernel, this.anchor, this.iterations, this.borderType, this.borderValue);
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
    properties = [
      { name: 'op', type: PropertyType.MorphTypes },
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

          cv.morphologyEx(src, out, this.op, kernel, this.anchor, this.iterations, this.borderType, this.borderValue);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Thinning component and node
 */
export class ThinningComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Thinning' };
  static processor = class ThinningNode extends CVFNodeProcessor {
    properties = [{ name: 'maxIterations', type: PropertyType.Integer }];

    kernel: Mat = cv.getStructuringElement(cv.MORPH_CROSS, new cv.Size(3, 3), new cv.Point(-1, -1));
    anchor: Point = new cv.Point(-1, -1);
    borderValue: Scalar = cv.morphologyDefaultBorderValue();
    maxIterations: number = 1000;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (!inputs.length) return;

      this.sources = [];

      for (const src of inputs) {
        if (!src) continue;

        let clone = src.clone();
        const out = new cv.Mat(src.rows, src.cols, src.type(), new cv.Scalar(0));
        const eroded = new cv.Mat(src.rows, src.cols, src.type());
        const open = new cv.Mat(src.rows, src.cols, src.type());
        const sub = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(clone);
        GCStore.add(out);
        GCStore.add(eroded);
        GCStore.add(open);
        GCStore.add(sub);

        let idx = this.maxIterations;
        while (cv.countNonZero(clone) !== 0 && idx-- > 0) {
          cv.erode(clone, eroded, this.kernel, this.anchor, 1, cv.BORDER_CONSTANT, this.borderValue);
          cv.dilate(eroded, open, this.kernel, this.anchor, 1, cv.BORDER_CONSTANT, this.borderValue);

          cv.subtract(clone, open, sub);

          cv.bitwise_or(out, sub, out);

          clone = eroded.clone();
          GCStore.add(clone);
        }

        this.sources.push(out);
        this.output(out);
      }
    }
  };
}
