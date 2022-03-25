import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';

const tabName = 'Segmentation';

/**
 * Threshold component and node
 */
export class ThresholdComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Threshold' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    static properties = [
      { name: 'thresh', type: PropertyType.Integer },
      { name: 'maxval', type: PropertyType.Integer },
      { name: 'type', type: PropertyType.ThresholdTypes },
    ];

    thresh: number = 0;
    maxval: number = 255;
    type: ThresholdTypes = cv.THRESH_BINARY_INV + cv.THRESH_OTSU;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, cv.CV_8U);
          cv.threshold(src, out, this.thresh, this.maxval, this.type);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Watershed component and node
 */
export class WatershedComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Watershed' };
  static processor = class Filter2DNode extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const gray = new cv.Mat();
          const opening = new cv.Mat();
          const coinsBg = new cv.Mat();
          const distTrans = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          cv.threshold(
            gray,
            gray,
            0,
            255,
            cv.THRESH_BINARY_INV + cv.THRESH_OTSU
          );
          const M = new cv.Mat.ones(3, 3, cv.CV_8U);
          cv.erode(gray, gray, M);
          cv.dilate(gray, opening, M);
          cv.dilate(opening, coinsBg, M, new cv.Point(-1, -1), 3);

          // distance transform
          cv.distanceTransform(opening, distTrans, cv.DIST_L2, 5);
          cv.normalize(distTrans, distTrans, 1, 0, cv.NORM_INF);

          const coinsFg = new cv.Mat();
          const unknown = new cv.Mat();
          const markers = new cv.Mat();

          // get foreground
          cv.threshold(distTrans, coinsFg, 0.7 * 1, 255, cv.THRESH_BINARY);
          coinsFg.convertTo(coinsFg, cv.CV_8U, 1, 0);
          cv.subtract(coinsBg, coinsFg, unknown);
          // get connected components markers
          cv.connectedComponents(coinsFg, markers);
          for (let i = 0; i < markers.rows; i++) {
            for (let j = 0; j < markers.cols; j++) {
              markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
              if (unknown.ucharPtr(i, j)[0] === 255) {
                markers.intPtr(i, j)[0] = 0;
              }
            }
          }
          cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
          cv.watershed(src, markers);
          for (let i = 0; i < markers.rows; i++) {
            for (let j = 0; j < markers.cols; j++) {
              if (markers.intPtr(i, j)[0] === -1) {
                src.ucharPtr(i, j)[0] = 255; // R
                src.ucharPtr(i, j)[1] = 0; // G
                src.ucharPtr(i, j)[2] = 0; // B
              }
            }
          }
          this.output(src);
        }
      }
    }
  };
}
