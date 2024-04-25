import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { cvInputTabName } from './tabname';

export class CVResizeComponent extends CVFIOComponent {
  static menu = { tabTitle: cvInputTabName, title: 'Resize' };
  static processor = class ResizeNode extends CVFNodeProcessor {
    properties = [
      { name: 'dsize', type: PropertyType.Size },
      { name: 'fx', type: PropertyType.Integer },
      { name: 'fy', type: PropertyType.Integer },
      { name: 'interpolation', type: PropertyType.Integer },
    ];

    dsize: Size = new cv.Size(32, 32);
    fx: number = 0;
    fy: number = 0;
    interpolation = cv.INTER_NEAREST;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out: Mat = new cv.Mat(this.dsize.height, this.dsize.width, src.type());
          GCStore.add(out);
          cv.resize(src, out, this.dsize, this.fx, this.fy, this.interpolation);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
