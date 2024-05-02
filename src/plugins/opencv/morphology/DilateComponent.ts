import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Scalar, Point, Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';
import { morphologytabName } from './tabname';

/**
 * Dilate component and node
 */
export class DilateComponent extends CVFIOComponent {
  static menu = { tabTitle: morphologytabName, title: 'Dilate' };
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
