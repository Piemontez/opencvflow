import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { DistanceTransformMasks, DistanceTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import GCStore from '../../../core/contexts/GCStore';
import { othersTabName } from './tabname';

/**
 * Distance Transform component and node
 */

export class DistanceTransformComponent extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'Distance Transform' };
  static processor = class DistanceTransformNode extends CVFNodeProcessor {
    properties = [
      { name: 'distanceType', type: PropertyType.DistanceTypes },
      { name: 'maskSize', type: PropertyType.DistanceTransformMasks },
    ];

    distanceType: DistanceTypes = cv.DIST_L2;
    maskSize: DistanceTransformMasks = cv.DIST_MASK_3;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          cv.distanceTransform(src, out, this.distanceType, this.maskSize);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
