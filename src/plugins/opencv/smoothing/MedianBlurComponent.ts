import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { smoothingTabName } from './tabname';

/**
 * MedianBlur component and node
 */

export class MedianBlurComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'Median' };
  static processor = class MedianBlurNode extends CVFNodeProcessor {
    properties = [{ name: 'kSize', type: PropertyType.Integer }];

    kSize: number = 3;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.medianBlur(src, out, this.kSize);
          
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
