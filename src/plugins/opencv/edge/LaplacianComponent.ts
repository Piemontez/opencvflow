import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { edgeTabName } from './tabname';

/**
 * Laplacian component and node
 */

export class LaplacianComponent extends CVFIOComponent {
  static menu = { tabTitle: edgeTabName, title: 'Laplacian' };
  static processor = class LaplacianNode extends CVFNodeProcessor {
    properties = [
      { name: 'dDepth', type: PropertyType.Integer },
      { name: 'kSize', type: PropertyType.Integer },
      { name: 'scale', type: PropertyType.Decimal },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    dDepth: number = cv.CV_8U;
    kSize: number = 3;
    scale: number = 1;
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.Laplacian(src, out, this.dDepth, this.kSize, this.scale, this.delta, this.borderType);
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
