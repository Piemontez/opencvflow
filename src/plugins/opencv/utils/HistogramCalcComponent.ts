import cv from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { PropertyType } from '../../../ide/types/PropertyType';
import { cvUtilsTabName } from './tabname';


export class HistogramCalcComponent extends CVFComponent {
  static menu = { tabTitle: cvUtilsTabName, title: 'Histogram Calc' };

  targets: TargetHandle[] = [
    { title: 'image', position: Position.Left },
    { title: 'maks', position: Position.Left },
  ];

  sources: SourceHandle[] = [{ title: 'hist', position: Position.Right }];

  static processor = class HistogramCalcProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'accumulate', type: PropertyType.Boolean },
      { name: 'channels', type: PropertyType.Integer },
      { name: 'histSize', type: PropertyType.Integer },
    ];

    accumulate: boolean = false;
    channels: number = 0;
    histSize = 256;
    ranges = [0, 256];

    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        this.sources = [];
        let [image, mask] = inputsAsMat;
        if (!image) return;
        if (!mask) {
          mask = new cv.Mat();
          GCStore.add(mask);
        }

        const srcVect = new cv.MatVector();
        srcVect.push_back(image);
        GCStore.add(srcVect);

        const hist = new cv.Mat();
        GCStore.add(hist);

        cv.calcHist(srcVect, [this.channels], mask, hist, [this.histSize], this.ranges, this.accumulate);

        // draw histogram
        const color = new cv.Scalar(0);
        const minmaxloc = cv.minMaxLoc(hist, mask);

        const max = minmaxloc.maxVal;
        const out = new cv.Mat(image.rows, this.histSize, cv.CV_8U, new cv.Scalar(255));
        GCStore.add(out);
        for (let i = 0; i < this.histSize; i++) {
          const binVal = (hist.data32F[i] * image.rows) / max;
          const point1 = new cv.Point(i, image.rows - 1);
          const point2 = new cv.Point(i + 1 - 1, image.rows - binVal);
          cv.rectangle(out, point1, point2, color, cv.FILLED);
        }
        this.output(out);

        this.sources = [hist];
      }
    }
  };
}
