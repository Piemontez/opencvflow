import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { ColorConversionCodes } from 'opencv-ts/src/core/ColorConversion';
import GCStore from '../../../core/contexts/GCStore';
import { conversorsTabName } from './tabname';

/**
 * CvtColor component and node
 */

export class CvtColorComponent extends CVFIOComponent {
  static menu = { tabTitle: conversorsTabName, title: 'CvtColor' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    properties = [
      { name: 'code', type: PropertyType.ColorConversionCodes },
      { name: 'dstCn', type: PropertyType.Integer },
    ];

    code: ColorConversionCodes = cv.COLOR_BGR2GRAY;
    dstCn: number = 0;

    async proccess() {
      const { inputsAsMat } = this;
      this.sources = [];
      for (const src of inputsAsMat) {
        if (!src) continue;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        cv.cvtColor(src, out, this.code, this.dstCn);

        this.sources.push(out);
        this.output(out);
      }
    }
  };
}
