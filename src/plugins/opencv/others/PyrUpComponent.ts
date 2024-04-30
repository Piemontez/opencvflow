import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { othersTabName } from './tabname';

/**
 * Pyr Up Transform component and node
 */

export class PyrUpComponent extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'PyrUp' };
  static processor = class PyrUpNode extends CVFNodeProcessor {
    properties = [
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