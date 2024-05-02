import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Scalar, Point, Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { morphologytabName } from './tabname';

/**
 * Closing component and node
 */
export class ClosingComponent extends CVFIOComponent {
  static menu = { tabTitle: morphologytabName, title: 'Closing' };
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
