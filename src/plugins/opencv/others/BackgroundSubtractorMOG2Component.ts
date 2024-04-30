import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat, BackgroundSubtractorMOG2 } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { othersTabName } from './tabname';

/**
 * BackgroundSubtractorMOG2 component and node
 */

export class BackgroundSubtractorMOG2Component extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'Background Subtractor MOG2' };
  static processor = class BackgroundSubtractorMOG2Node extends CVFNodeProcessor {
    properties = [
      { name: 'history', type: PropertyType.Integer },
      { name: 'varThreshold', type: PropertyType.Decimal },
      { name: 'detectShadows', type: PropertyType.Boolean },
    ];

    history: number = 500;
    varThreshold: number = 16;
    detectShadows: boolean = true;

    subtractor?: BackgroundSubtractorMOG2;
    fgmask?: Mat;

    async start() {
      this.subtractor = new cv.BackgroundSubtractorMOG2(this.history, this.varThreshold, this.detectShadows);
    }

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        inputs.forEach((src) => {
          if (!this.fgmask) this.fgmask = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);

          this.subtractor!.apply(src, this.fgmask);

          this.sources.push(this.fgmask);
          this.output(this.fgmask);
        });
      }
    }

    async stop() {
      this.fgmask?.delete();
      this.fgmask = undefined;
    }
  };
}
