import { CVFComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { Position } from 'reactflow';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import GCStore from '../../../core/contexts/GCStore';
import { segmentationTabName } from './tabname';

/**
 * Watershed component and node
 */

export class WatershedComponent extends CVFComponent {
  static menu = { tabTitle: segmentationTabName, title: 'Watershed' };
  targets: TargetHandle[] = [
    { title: 'image', position: Position.Left },
    { title: 'markers', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class WatershedNode extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length === 2) {
        const [src, markers] = inputs;
        const out = markers.clone();
        GCStore.add(out);

        cv.watershed(src, out);

        this.output(out);
        this.sources = [out];
      }
    }
  };
}
