import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { edgeTabName } from './tabname';

/**
 * Canny component and node
 */

export class CannyComponent extends CVFIOComponent {
  static menu = { tabTitle: edgeTabName, title: 'Canny' };
  static processor = class CannyNode extends CVFNodeProcessor {
    properties = [
      { name: 'tthreshold1', type: PropertyType.Decimal },
      { name: 'threshold2', type: PropertyType.Decimal },
      { name: 'aperturesize', type: PropertyType.Integer },
      { name: 'l2gradiente', type: PropertyType.Boolean },
    ];

    tthreshold1: number = 80;
    threshold2: number = 170;
    aperturesize: number = 3;
    l2gradiente: boolean = false;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;

          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.Canny(src, out, this.tthreshold1, this.tthreshold1);
          
          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
