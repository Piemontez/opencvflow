import { CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Size } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from 'renderer/contexts/GCStore';
import { SourceHandle } from 'renderer/types/handle';
import { Position } from 'react-flow-renderer/nocss';
import messages from '../messages';

const tabName = 'Transform';

/**
 * DFT Transform component and node
 */
export class DFTComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'DFT' };

  sources: SourceHandle[] = [
    { title: 'dftComplexI', position: Position.Right },
    { title: 'magnitude', position: Position.Right },
    { title: 'angle', position: Position.Right },
    { title: 'spectrum', position: Position.Right },
  ];

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
          if (!src) continue;
          if (src.channels() > 1) {
            throw new Error(
              messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace(
                '{1}',
                src.channels().toString()
              )
            );
          }

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

          // compute log(1 + sqrt(Re(DFT(img))**2 + Im(DFT(img))**2))
          const angle = new cv.Mat();
          const mag = new cv.Mat();

          GCStore.add(mag);
          GCStore.add(angle);

          cv.split(complexI, planes);
          cv.cartToPolar(planes.get(0), planes.get(1), mag, angle);

          const m1 = new cv.Mat.ones(mag.rows, mag.cols, mag.type());
          cv.add(mag, m1, mag);
          cv.log(mag, mag);

          // crop the spectrum, if it has an odd number of rows or columns
          const rect = new cv.Rect(0, 0, mag.cols & -2, mag.rows & -2);
          const spectrum = mag.roi(rect);

          // rearrange the quadrants of Fourier image
          // so that the origin is at the image center
          const cx = spectrum.cols / 2;
          const cy = spectrum.rows / 2;
          const tmp = new cv.Mat();

          const rect0 = new cv.Rect(0, 0, cx, cy);
          const rect1 = new cv.Rect(cx, 0, cx, cy);
          const rect2 = new cv.Rect(0, cy, cx, cy);
          const rect3 = new cv.Rect(cx, cy, cx, cy);

          const q0 = spectrum.roi(rect0);
          const q1 = spectrum.roi(rect1);
          const q2 = spectrum.roi(rect2);
          const q3 = spectrum.roi(rect3);

          // exchange 1 and 4 quadrants
          q0.copyTo(tmp);
          q3.copyTo(q0);
          tmp.copyTo(q3);

          // exchange 2 and 3 quadrants
          q1.copyTo(tmp);
          q2.copyTo(q1);
          tmp.copyTo(q2);

          // The pixel value of cv.CV_32S type image ranges from 0 to 1.
          cv.normalize(spectrum, spectrum, 0, 1, cv.NORM_MINMAX);

          this.sources = [complexI, mag, angle, spectrum];
          this.output(spectrum);
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

          cv.dft(src, out, cv.DCT_INVERSE | cv.DFT_REAL_OUTPUT, 0);
          cv.normalize(out, out, 0, 1, cv.NORM_MINMAX);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
