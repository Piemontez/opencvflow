import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { smoothingTabName } from './tabname';

/**
 * BilateralFilter component and node
 */

export class BilateralFilterComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'Bilateral' };
  static processor = class BilateralFilterNode extends CVFNodeProcessor {
    properties = [
      { name: 'd', type: PropertyType.Integer },
      { name: 'sigmaColor', type: PropertyType.Decimal },
      { name: 'sigmaSpace', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    d: number = 1;
    sigmaColor: number = 1;
    sigmaSpace: number = 1;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.bilateralFilter(src, out, this.d, this.sigmaColor, this.sigmaSpace, this.borderType);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
