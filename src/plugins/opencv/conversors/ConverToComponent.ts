import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import GCStore from '../../../core/contexts/GCStore';
import { conversorsTabName } from './tabname';

/**
 * ConverTo component and node
 */

export class ConverToComponent extends CVFIOComponent {
  static menu = { tabTitle: conversorsTabName, title: 'ConverTo' };
  static processor = class ConverToNode extends CVFNodeProcessor {
    properties = [
      { name: 'rtype', type: PropertyType.DataTypes },
      { name: 'alpha', type: PropertyType.Decimal },
      { name: 'beta', type: PropertyType.Decimal },
    ];

    rtype: DataTypes = cv.CV_8U;
    alpha: number = 1;
    beta: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          src.convertTo(out, this.rtype, this.alpha, this.beta);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
