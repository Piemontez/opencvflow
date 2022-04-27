import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Point, Mat, BackgroundSubtractorMOG2, Size } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import {
  DistanceTransformMasks,
  DistanceTypes,
  GrabCutModes,
} from 'opencv-ts/src/ImageProcessing/Misc';
import GCStore from 'renderer/contexts/GCStore';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { Position } from 'react-flow-renderer/nocss';

const tabName = 'Others';

/**
 * Distance Transform component and node
 */
export class DistanceTransformComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Distance Transform' };
  static processor = class DistanceTransformNode extends CVFNodeProcessor {
    static properties = [
      { name: 'distanceType', type: PropertyType.DistanceTypes },
      { name: 'maskSize', type: PropertyType.DistanceTransformMasks },
    ];

    distanceType: DistanceTypes = cv.DIST_L2;
    maskSize: DistanceTransformMasks = cv.DIST_MASK_3;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.distanceTransform(src, out, this.distanceType, this.maskSize);

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
    static properties = [
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

/**
 * BackgroundSubtractorMOG2 component and node
 */
export class BackgroundSubtractorMOG2Component extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'BGSubtractorMog2' };
  static processor = class BackgroundSubtractorMOG2Node extends CVFNodeProcessor {
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
      const { inputsAsMat: inputs } = this;
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
 * GrabCut component and node
 */
export class GrabCutComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'GrabCut' };
  static processor = class GrabCutNode extends CVFNodeProcessor {
    static properties = [
      { name: 'iterCount', type: PropertyType.Integer },
      { name: 'mode', type: PropertyType.Decimal },
    ];

    iterCount: number = 1;
    mode: GrabCutModes = cv.GC_INIT_WITH_RECT;

    mask?: Mat;
    bgdModel?: Mat;
    fgdModel?: Mat;

    async start() {
      this.mask = new cv.Mat();
      this.bgdModel = new cv.Mat();
      this.fgdModel = new cv.Mat();
    }

    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        this.sources = [];
        for (const src of inputsAsMat) {
          if (!src) continue;

          const out = src.clone();
          GCStore.add(out);

          cv.grabCut(
            out,
            this.mask!,
            new cv.Rect(0, 0, src.cols, src.rows),
            this.bgdModel!,
            this.fgdModel!,
            this.iterCount,
            this.mode
          );

          this.sources.push(out);
          this.output(out);
        }
      }
    }

    async stop() {
      this.mask!.delete();
      this.bgdModel!.delete();
      this.fgdModel!.delete();

      this.mask = undefined;
      this.bgdModel = undefined;
      this.fgdModel = undefined;
    }
  };
}

/**
 * Pyr Down Transform component and node
 */
export class PyrDownComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'PyrDown' };
  static processor = class PyrDownNode extends CVFNodeProcessor {
    static properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.pyrDown(src, out, this.dstsize, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Pyr Up Transform component and node
 */
export class PyrUpComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'PyrUp' };
  static processor = class PyrUpNode extends CVFNodeProcessor {
    static properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.pyrUp(src, out, this.dstsize, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
