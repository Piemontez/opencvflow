import { CVFComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Scalar, Point } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { MorphTypes } from 'opencv-ts/src/ImageProcessing/ImageFiltering';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';
import { morphologytabName } from './tabname';

/**
 * MorphologyEx component and node
 */
export class MorphologyExComponent extends CVFComponent {
  static menu = { tabTitle: morphologytabName, title: 'Morphology Ex' };

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
