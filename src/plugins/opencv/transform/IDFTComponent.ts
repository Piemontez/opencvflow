import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat, Size } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';
import { transformTabName } from './tabname';

/**
 * IDFT Transform component and node
 */

export class IDFTComponent extends CVFIOComponent {
  static menu = { tabTitle: transformTabName, title: 'IDFT' };
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
