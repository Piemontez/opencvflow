import cv, { Mat } from 'opencv-ts';
import { NormTypes } from 'opencv-ts/src/core/CoreArray';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import { Position } from 'react-flow-renderer/nocss';
import GCStore from 'renderer/contexts/GCStore';
import {
  CVFOutputComponent,
  CVFIOEndlessComponent,
  CVFComponent,
  CVFIOComponent,
} from 'renderer/types/component';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { CVFNodeProcessor } from 'renderer/types/node';
import { PropertyType } from 'renderer/types/property';

const tabName = 'Arithmetic';

export class CVPlusComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Add' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
    { title: 'masc', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class PlusProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, src2, masc] = inputs;

      if (src1 && src2) {
        const out: Mat = new cv.Mat(
          src1.rows,
          src1.cols,
          src1.type(),
          new cv.Scalar(0)
        );
        GCStore.add(out);

        if (masc) {
          cv.add(src1, src2, out, masc);
        } else if (inputs.length === 2) {
          cv.add(src1, src2, out);
        }

        this.output(out);
        this.sources = [out];
      }
    }
  };
}

export class CVSubComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Subtract' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
    { title: 'masc', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class SubProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, src2, masc] = inputs;

      if (src1 && src2) {
        const out: Mat = new cv.Mat(
          src1.rows,
          src1.cols,
          src1.type(),
          new cv.Scalar(0)
        );
        GCStore.add(out);

        if (masc) {
          cv.subtract(src1, src2, out, masc);
        } else if (inputs.length === 2) {
          cv.subtract(src1, src2, out);
        }

        this.output(out);
        this.sources = [out];
      }
    }
  };
}

export class CVMultiplyComponent extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Multiply' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];

  static processor = class MultiplyProcessor extends CVFNodeProcessor {
    async proccess() {
      let out: Mat | null = null;

      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        this.sources = [];
        for (const src of inputsAsMat) {
          if (!out) {
            out = src.clone();
            GCStore.add(out);
          } else {
            cv.multiply(out, src, out, 1);
          }
        }
      }

      if (out) {
        this.output(out);
        this.sources = [out];
      } else {
        this.sources = [];
      }
    }
  };
}

export class CVDivisionComponent extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Divide' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];

  static processor = class DivisionProcessor extends CVFNodeProcessor {
    async proccess() {
      let out: Mat | null = null;

      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!out) {
            out = src.clone();
            GCStore.add(out);
          } else {
            cv.divide(out, src, out, 1);
          }
        }
      }

      if (out) {
        this.output(out);
        this.sources = [out];
      } else {
        this.sources = [];
      }
    }
  };
}

export class CVMulComponent extends CVFIOEndlessComponent {
  static menu = { tabTitle: tabName, title: 'Mul' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];

  static processor = class MulProcessor extends CVFNodeProcessor {
    async proccess() {
      let out: Mat | null = null;

      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!out) {
            out = src.clone();
            GCStore.add(out);
          } else {
            out = out.mul(src);
          }
        }
      }

      if (out) {
        this.output(out);
        this.sources = [out];
      } else {
        this.sources = [];
      }
    }
  };
}

export class CVNormalizeComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Normalize' };

  static processor = class NormalizeProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'alpha', type: PropertyType.Integer },
      { name: 'beta', type: PropertyType.Integer },
      { name: 'normType', type: PropertyType.Integer },
      { name: 'dtype', type: PropertyType.Integer },
    ];

    alpha: number = 1;
    beta: number = 0;
    normType: NormTypes = cv.NORM_INF;
    dtype?: DataTypes;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.normalize(
            src,
            out,
            this.alpha,
            this.beta,
            this.normType,
            this.dtype === undefined ? src.type() : this.dtype
          );

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

export class CVConvertScaleAbsComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Convert Scale Abs' };

  static processor = class ConvertScaleAbsProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'alpha', type: PropertyType.Integer },
      { name: 'beta', type: PropertyType.Integer },
    ];

    alpha: number = 1;
    beta: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.convertScaleAbs(src, out, this.alpha, this.beta);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
