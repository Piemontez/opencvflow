import cv, { Point } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../core/contexts/GCStore';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { SourceHandle, TargetHandle } from '../../core/types/handle';
import { CVFNodeProcessor } from '../../core/types/node';
import { PropertyType } from '../../ide/types/PropertyType';
import { cvUtilsTabName } from './tabname';

export class HistogramCalcComponent extends CVFComponent {
  static menu = { tabTitle: cvUtilsTabName, title: 'Histogram Calc' };

  targets: TargetHandle[] = [
    { title: 'image', position: Position.Left },
    { title: 'maks', position: Position.Left },
  ];

  sources: SourceHandle[] = [
    { title: 'hist1', position: Position.Right },
    { title: 'hist2', position: Position.Right },
    { title: 'hist3', position: Position.Right },
    { title: 'hist4', position: Position.Right },
  ];

  static processor = class HistogramCalcProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'accumulate', type: PropertyType.Boolean },
      { name: 'histSize', type: PropertyType.Integer },
    ];

    accumulate: boolean = false;
    histSize = 256;
    ranges = [0, 256];

    histHeight = 170;
    colorBlack = [new cv.Scalar(0, 0, 0)];
    colorRGB = [new cv.Scalar(255, 0, 0), new cv.Scalar(0, 255, 0), new cv.Scalar(0, 0, 255), new cv.Scalar(128, 128, 128)];

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

        const channels = image.channels();
        const out = new cv.Mat(this.histHeight, this.histSize, channels > 1 ? cv.CV_8UC3 : cv.CV_8U, new cv.Scalar(255, 255, 255));
        GCStore.add(out);

        const colors = channels > 1 ? this.colorRGB : this.colorBlack;

        for (let channel = channels - 1; channel >= 0; channel--) {
          const hist = new cv.Mat();
          GCStore.add(hist);

          cv.calcHist(srcVect, [channel], mask, hist, [this.histSize], this.ranges, this.accumulate);

          // draw histogram
          const minmaxloc = cv.minMaxLoc(hist, mask);

          const max = minmaxloc.maxVal;

          let lastPoint = undefined as Point | undefined;
          for (let i = 0; i < this.histSize; i++) {
            if (!hist.data32F[i]) {
              lastPoint = undefined;
              continue;
            }
            const binVal = this.histHeight - (hist.data32F[i] * this.histHeight) / max;
            if (channels === 1) {
              lastPoint = new cv.Point(i, this.histSize);
            } else if (lastPoint === undefined) {
              lastPoint = new cv.Point(i, binVal);
            }
            const point = new cv.Point(i, binVal);

            cv.line(out, lastPoint, point, colors[channel], 1);
            lastPoint = point;
          }

          this.sources.push(hist);
        }
        this.output(out);
      }
    }
  };
}
