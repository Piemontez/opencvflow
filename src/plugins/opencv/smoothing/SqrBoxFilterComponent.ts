import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Point, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { smoothingTabName } from './tabname';

/**
 * SqrBoxFilter component and node
 */

export class SqrBoxFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'SqrBox' };
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

          cv.sqrBoxFilter(src, out, this.ddepth, this.ksize, this.anchor, this.normalize, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
