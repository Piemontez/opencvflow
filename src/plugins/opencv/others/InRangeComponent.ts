import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import GCStore from '../../../core/contexts/GCStore';
import { othersTabName } from './tabname';
import { TargetHandle } from 'core/types/handle';
import { Position } from 'reactflow';

/**
 * InRange component and node
 */

export class InRangeComponent extends CVFIOComponent {
  static menu = { tabTitle: othersTabName, title: 'InRange' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'min', position: Position.Left },
    { title: 'max', position: Position.Left },
  ];

  static processor = class InRangeNode extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat } = this;

      if (inputsAsMat.length < 3) {
        this.sources = [];
        return;
      }

      let [src, min, max] = inputsAsMat;
      if (!src.rows) {
        return;
      }

      const out = new cv.Mat(src.rows, src.cols, src.type());
      GCStore.add(out);

      cv.inRange(src, min, max, out);

      this.sources = [out];
      this.output(out);
    }
  };
}
