import cv from 'opencv-ts';
import { NormTypes } from 'opencv-ts/src/core/CoreArray';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import GCStore from '../../../core/contexts/GCStore';
import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import { PropertyType } from '../../../ide/types/PropertyType';
import { arithmeticTabName } from './tabname';


export class CVNormalizeComponent extends CVFIOComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Normalize' };

  static processor = class NormalizeProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'alpha', type: PropertyType.Integer },
      { name: 'beta', type: PropertyType.Integer },
      { name: 'normType', type: PropertyType.NormTypes },
      { name: 'dtype', type: PropertyType.Integer },
    ];

    alpha: number = 1;
    beta: number = 0;
    normType: NormTypes = cv.NORM_INF;
    dtype?: DataTypes;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.normalize(src, out, this.alpha, this.beta, this.normType, this.dtype === undefined ? src.type() : this.dtype);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
