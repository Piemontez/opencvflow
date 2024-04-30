import cv, { Mat } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFIOComponent } from '../../../ide/types/component';
import { TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { arithmeticTabName } from './tabname';


export class CVMultiplyComponent extends CVFIOComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Multiply' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];

  static processor = class MultiplyProcessor extends CVFNodeProcessor {
    async proccess() {
      let out: Mat | null = null;

      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        this.sources = [];
        for (const src of inputsAsMat) {
          if (!out) {
            out = src.clone();
            GCStore.add(out);
          } else {
            cv.multiply(out, src, out, 1);
          }
        }
      }

      if (out) {
        this.output(out);
        this.sources = [out];
      } else {
        this.sources = [];
      }
    }
  };
}
