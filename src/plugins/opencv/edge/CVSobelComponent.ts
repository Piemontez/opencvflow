import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { edgeTabName } from './tabname';

/**
 * Sobel component and node
 */

export class CVSobelComponent extends CVFIOComponent {
  static menu = { tabTitle: edgeTabName, title: 'Sobel' };

  static processor = class SobelProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'dDepth', type: PropertyType.Integer },
      { name: 'dX', type: PropertyType.Integer },
      { name: 'dY', type: PropertyType.Integer },
      { name: 'kSize', type: PropertyType.Integer },
      { name: 'scale', type: PropertyType.Decimal },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    dDepth: number = cv.CV_8U;
    dX: number = 1;
    dY: number = 0;
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

          const out = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);
          GCStore.add(out);

          cv.Sobel(src, out, this.dDepth, this.dX, this.dY, this.kSize, this.scale, this.delta, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
