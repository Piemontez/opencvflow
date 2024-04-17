import cv, { Mat, MatVector, Point } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'reactflow';
import GCStore from '../../../ide/contexts/GCStore';
import {
  CVFComponent,
  CVFComponentOptions,
  CVFIOComponent,
} from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../ide/types/handle';
import { CVFNodeProcessor } from '../../../ide/types/node';
import { PropertyType } from '../../../ide/types/property';

const tabName = 'Utils';

export class MomentsComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Moments' };

  sources: SourceHandle[] = [{ title: 'moments', position: Position.Right }];

  componentDidMount() {
    this.addOption(CVFComponentOptions.NOT_DISPLAY);
  }

  static processor = class ContoursCentersProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        const [src] = inputs;
        if ((src as MatVector).size) {
          const out = [] as Array<Moments>;
          for (let i = 0; i < (src as MatVector).size(); ++i) {
            const mat = (src as MatVector).get(i);
            GCStore.add(mat);

            out.push(cv.moments(mat));
          }
          this.sources.push(out);
        } else {
          this.sources.push(cv.moments(src as Mat));
        }
      }
    }
  };
}

export class ContoursCentersComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Contours Centers' };

  sources: SourceHandle[] = [{ title: 'points', position: Position.Right }];

  componentDidMount() {
    this.addOption(CVFComponentOptions.NOT_DISPLAY);
  }

  static processor = class ContoursCentersProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) return;

          let ms: Array<Moments> = [];
          if (Array.isArray(src)) {
            ms = src as Array<Moments>;
          } else {
            ms = [src as Moments];
          }

          const out = [] as Array<Point>;
          for (const m of ms) {
            if (m.m00) {
              const cx = Math.floor(m.m10 / m.m00);
              const cy = Math.floor(m.m01 / m.m00);
              out.push(new cv.Point(cx, cy));
            }
          }
          this.sources = [out];
        }
      }
    }
  };
}

export class HistogramCalcComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Histogram Calc' };

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

        cv.calcHist(
          srcVect,
          [this.channels],
          mask,
          hist,
          [this.histSize],
          this.ranges,
          this.accumulate
        );

        // draw histogram
        const color = new cv.Scalar(0);
        const minmaxloc = cv.minMaxLoc(hist, mask);

        const max = minmaxloc.maxVal;
        const out = new cv.Mat(
          image.rows,
          this.histSize,
          cv.CV_8U,
          new cv.Scalar(255)
        );
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
