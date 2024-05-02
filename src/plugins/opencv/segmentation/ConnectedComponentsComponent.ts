import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { segmentationTabName } from './tabname';

/**
 * Threshold component and node
 */

export class ConnectedComponentsComponent extends CVFIOComponent {
  static menu = { tabTitle: segmentationTabName, title: 'Connected Components' };

  static processor = class ConnectedComponentsNode extends CVFNodeProcessor {
    properties = [{ name: 'display', type: PropertyType.Decimal }];

    display: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat();
          GCStore.add(out);

          cv.connectedComponents(src, out);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
