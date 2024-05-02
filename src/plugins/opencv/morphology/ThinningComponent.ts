import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Scalar, Point, Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { morphologytabName } from './tabname';

/**
 * Thinning component and node
 */
export class ThinningComponent extends CVFIOComponent {
  static menu = { tabTitle: morphologytabName, title: 'Thinning' };
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
