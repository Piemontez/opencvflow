import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { smoothingTabName } from './tabname';

/**
 * GaussianBlur component and node
 */

export class GaussianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'Gaussian' };
  static processor = class GaussianBlurNode extends CVFNodeProcessor {
    properties = [
      { name: 'size', type: PropertyType.Size },
      { name: 'sigmaX', type: PropertyType.Decimal },
      { name: 'sigmaY', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    size: Size = new cv.Size(3, 3);
    sigmaX: number = 1;
    sigmaY: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.GaussianBlur(src, out, this.size, this.sigmaX, this.sigmaY, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
