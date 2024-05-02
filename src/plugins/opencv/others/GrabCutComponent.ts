import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { GrabCutModes } from 'opencv-ts/src/ImageProcessing/Misc';
import GCStore from '../../../core/contexts/GCStore';
import { othersTabName } from './tabname';

/**
 * GrabCut component and node
 */

export class GrabCutComponent extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'GrabCut' };
  static processor = class GrabCutNode extends CVFNodeProcessor {
    properties = [
      { name: 'iterCount', type: PropertyType.Integer },
      { name: 'mode', type: PropertyType.Decimal },
    ];

    iterCount: number = 1;
    mode: GrabCutModes = cv.GC_INIT_WITH_RECT;

    mask?: Mat;
    bgdModel?: Mat;
    fgdModel?: Mat;

    async start() {
      this.mask = new cv.Mat();
      this.bgdModel = new cv.Mat();
      this.fgdModel = new cv.Mat();
    }

    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        this.sources = [];
        for (const src of inputsAsMat) {
          if (!src) continue;

          const out = src.clone();
          GCStore.add(out);

          cv.grabCut(out, this.mask!, new cv.Rect(0, 0, src.cols, src.rows), this.bgdModel!, this.fgdModel!, this.iterCount, this.mode);

          this.sources.push(out);
          this.output(out);
        }
      }
    }

    async stop() {
      this.mask!.delete();
      this.bgdModel!.delete();
      this.fgdModel!.delete();

      this.mask = undefined;
      this.bgdModel = undefined;
      this.fgdModel = undefined;
    }
  };
}
