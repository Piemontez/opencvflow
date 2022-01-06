import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';

const tabName = 'ImgProc';

export class CVSobelComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Sobel' };

  static processor = class SobelProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'DDepth', type: PropertyType.Integer },
      { name: 'DX', type: PropertyType.Integer },
      { name: 'DY', type: PropertyType.Integer },
      { name: 'KSize', type: PropertyType.Integer },
      { name: 'Scale', type: PropertyType.Decimal },
      { name: 'Delta', type: PropertyType.Decimal },
    ];

    DDepth: number = cv.CV_8U;
    DX: number = 1;
    DY: number = 0;
    KSize: number = 3;
    Scale: number = 1;
    Delta: number = 0;
    BorderType: number = cv.BORDER_DEFAULT;

    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const dst = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);

          cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
          cv.Sobel(
            src,
            dst,
            this.DDepth,
            this.DX,
            this.DY,
            this.KSize,
            this.Scale,
            this.Delta,
            this.BorderType
          );

          this.sources.push(dst);

          this.output(dst);
        }
      }
    }
  };
}
