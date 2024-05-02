import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import GCStore from '../../../core/contexts/GCStore';
import { othersTabName } from './tabname';

/**
 * Equalize Hist component and node
 */

export class EqualizeHistComponent extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'Equalize Hist' };
  static processor = class EqualizeHistNode extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = GCStore.add(new cv.Mat(src.rows, src.cols, src.type()));

          cv.equalizeHist(src, out);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
