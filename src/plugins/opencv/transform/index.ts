import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Size } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from 'renderer/contexts/GCStore';
import { SourceHandle } from 'renderer/types/handle';
import { Position } from 'react-flow-renderer';

const tabName = 'Others';

/**
 * DFT Transform component and node
 */
export class DFTComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'DFT' };

  sources: SourceHandle[] = [{ title: 'complexI', position: Position.Right }];

  static processor = class DFTNode extends CVFNodeProcessor {
    static properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          // get optimal size of DFT
          const optimalRows = cv.getOptimalDFTSize(src.rows);
          const optimalCols = cv.getOptimalDFTSize(src.cols);
          const s0 = cv.Scalar.all(0);
          const padded = new cv.Mat();
          cv.copyMakeBorder(
            src,
            padded,
            0,
            optimalRows - src.rows,
            0,
            optimalCols - src.cols,
            cv.BORDER_CONSTANT,
            s0
          );

          // use cv.MatVector to distribute space for real part and imaginary part
          const planes = new cv.MatVector();
          const complexI = new cv.Mat();
          const plane0 = new cv.Mat();
          const plane1 = new cv.Mat.zeros(padded.rows, padded.cols, cv.CV_32F);
          padded.convertTo(plane0, cv.CV_32F);
          planes.push_back(plane0);
          planes.push_back(plane1);
          cv.merge(planes, complexI);

          cv.dft(complexI, complexI, 0, 0);

          GCStore.add(planes);
          GCStore.add(complexI);
          GCStore.add(plane0);
          GCStore.add(plane1);

          this.sources.push(complexI);
          //this.output(out);
        }
      }
    }
  };
}

/**
 * IDFT Transform component and node
 */
export class IDFTComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'IDFT' };
  static processor = class IDFTNode extends CVFNodeProcessor {
    static properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.pyrUp(src, out, this.dstsize, this.borderType);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
