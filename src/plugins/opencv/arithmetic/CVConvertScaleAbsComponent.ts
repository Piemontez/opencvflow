import cv from 'opencv-ts';
import GCStore from '../../../core/contexts/GCStore';
import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import { PropertyType } from '../../../ide/types/PropertyType';
import { arithmeticTabName } from './tabname';


export class CVConvertScaleAbsComponent extends CVFIOComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Convert Scale Abs' };

  static processor = class ConvertScaleAbsProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'alpha', type: PropertyType.Integer },
      { name: 'beta', type: PropertyType.Integer },
    ];

    alpha: number = 1;
    beta: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.convertScaleAbs(src, out, this.alpha, this.beta);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
