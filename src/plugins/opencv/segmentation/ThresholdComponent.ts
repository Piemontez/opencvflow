import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import GCStore from '../../../core/contexts/GCStore';
import messages from '../messages';
import { segmentationTabName } from './tabname';

/**
 * Threshold component and node
 */

export class ThresholdComponent extends CVFIOComponent {
  static menu = { tabTitle: segmentationTabName, title: 'Threshold' };

  static processor = class ThresholdNode extends CVFNodeProcessor {
    properties = [
      { name: 'thresh', type: PropertyType.Decimal },
      { name: 'maxval', type: PropertyType.Decimal },
      { name: 'type', type: PropertyType.ThresholdTypes },
    ];

    thresh: number = 0;
    maxval: number = 255;
    type: ThresholdTypes = cv.THRESH_BINARY_INV + cv.THRESH_OTSU;

    async proccess() {
      const { inputsAsMat: inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (src.channels() > 1) {
            throw new Error(messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace('{1}', src.channels().toString()));
          }
          const out = new cv.Mat(src.rows, src.cols, cv.CV_8U);
          GCStore.add(out);

          cv.threshold(src, out, this.thresh, this.maxval, this.type);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
