import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';
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
    properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;
    flags: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) continue;
          if (src.channels() > 1) {
            throw new Error(messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace('{1}', src.channels().toString()));
          }

          // get optimal size of DFT
          const optimalRows = cv.getOptimalDFTSize(src.rows);
          const optimalCols = cv.getOptimalDFTSize(src.cols);
          const s0 = cv.Scalar.all(0);
          const padded = GCStore.add(new cv.Mat());

          cv.copyMakeBorder(src, padded, 0, optimalRows - src.rows, 0, optimalCols - src.cols, cv.BORDER_CONSTANT, s0);

          // use cv.MatVector to distribute space for real part and imaginary part
          const planes = GCStore.add(new cv.MatVector());
          const complexI = GCStore.add(new cv.Mat());
          const plane0 = GCStore.add(new cv.Mat());
          const plane1 = GCStore.add(new cv.Mat.zeros(padded.rows, padded.cols, cv.CV_32F)) as Mat;

          padded.convertTo(plane0, cv.CV_32F);
          planes.push_back(plane0);
          planes.push_back(plane1);
          cv.merge(planes, complexI);

          cv.dft(complexI, complexI, this.flags, 0);

          // compute log(1 + sqrt(Re(DFT(img))**2 + Im(DFT(img))**2))
          const angle = GCStore.add(new cv.Mat());
          const mag = GCStore.add(new cv.Mat());

          cv.split(complexI, planes);
          cv.cartToPolar(planes.get(0), planes.get(1), mag, angle);

          const m1 = GCStore.add(new cv.Mat.ones(mag.rows, mag.cols, mag.type())) as Mat;

          cv.add(mag, m1, mag);
          cv.log(mag, mag);

          // crop the spectrum, if it has an odd number of rows or columns
          const rect = new cv.Rect(0, 0, mag.cols & -2, mag.rows & -2);
          const spectrum = GCStore.add(GCStore.add(mag.clone()).roi(rect));

          // rearrange the quadrants of Fourier image
          // so that the origin is at the image center
          const cx = spectrum.cols / 2;
          const cy = spectrum.rows / 2;
          const tmp = GCStore.add(new cv.Mat());

          const rect0 = new cv.Rect(0, 0, cx, cy);
          const rect1 = new cv.Rect(cx, 0, cx, cy);
          const rect2 = new cv.Rect(0, cy, cx, cy);
          const rect3 = new cv.Rect(cx, cy, cx, cy);

          const q0 = GCStore.add(spectrum.roi(rect0));
          const q1 = GCStore.add(spectrum.roi(rect1));
          const q2 = GCStore.add(spectrum.roi(rect2));
          const q3 = GCStore.add(spectrum.roi(rect3));

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
  targets: TargetHandle[] = [
    { title: 'complexOrMag', position: Position.Left },
    { title: 'angle', position: Position.Left },
  ];

  static processor = class IDFTNode extends CVFNodeProcessor {
    properties = [
      { name: 'dstsize', type: PropertyType.Size },
      { name: 'borderType', type: PropertyType.DistanceTransformMasks },
    ];

    dstsize: Size = new cv.Size(0, 0);
    borderType: BorderTypes = cv.BORDER_DEFAULT;

    async proccess() {
      const { inputsAsMat } = this;
      this.sources = [];

      const [compOrMag, angle] = inputsAsMat;
      if (compOrMag) {
        const out = new cv.Mat(compOrMag.rows, compOrMag.cols, compOrMag.type());
        GCStore.add(out);

        if (angle) {
          const planes = GCStore.add(new cv.MatVector());
          const x = GCStore.add(new cv.Mat());
          const y = GCStore.add(new cv.Mat());

          cv.exp(compOrMag, compOrMag);

          cv.polarToCart(compOrMag, angle, x, y, false);
          planes.push_back(x);
          planes.push_back(y);

          cv.merge(planes, compOrMag);
        }

        cv.dft(compOrMag as Mat, out, cv.DCT_INVERSE | cv.DFT_REAL_OUTPUT, 0);
        cv.normalize(out, out, 0, 1, cv.NORM_MINMAX);

        this.sources.push(out);
        this.output(out);
      }
    }
  };
}
