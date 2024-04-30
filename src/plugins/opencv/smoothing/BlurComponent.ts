import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Point, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { smoothingTabName } from './tabname';

/**
 * Blur component and node
 */

export class BlurComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'Blur' };
  static processor = class BlurNode extends CVFNodeProcessor {
    properties = [
      { name: 'ksize', type: PropertyType.Size },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ksize: Size = new cv.Size(3, 3);
    anchor: Point = new cv.Point(-1, -1);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.blur(src, out, this.ksize, this.anchor, this.borderType);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
