import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';

const tabName = 'ImgProc';

export class CVSobelComponent extends CVFIOComponent {
  get title() {
    return 'Sobel';
  }
  static menu = { tabTitle: tabName, title: 'Sobel' };

  static processor = class SobelProcessor extends CVFNodeProcessor {
    async proccess() {
      const inputs = this.inputs;
      if (inputs.length) {
        this.sources = [];
        for (const input of inputs) {
          const src = input.sources[0];
          const dst = new cv.Mat(src.rows, src.cols, cv.CV_8UC1);

          cv.cvtColor(src, src, cv.COLOR_RGB2GRAY, 0);
          cv.Sobel(src, dst, cv.CV_8U, 1, 0, 3, 1, 0, cv.BORDER_DEFAULT);

          this.sources.push(dst);

          this.output(dst);
        }
      }
    }
  };
}
