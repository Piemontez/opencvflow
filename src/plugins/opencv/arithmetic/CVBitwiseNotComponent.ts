import cv, { Mat } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { arithmeticTabName } from './tabname';


export class CVBitwiseNotComponent extends CVFComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Bitwise Not' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'masc', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class BitwiseNotProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, masc] = inputs;

      if (src1) {
        const out: Mat = new cv.Mat(src1.rows, src1.cols, src1.type(), new cv.Scalar(0));
        GCStore.add(out);

        if (masc) {
          cv.bitwise_not(src1, out, masc);
        } else if (inputs.length === 2) {
          cv.bitwise_not(src1, out);
        }

        this.output(out);
        this.sources = [out];
      }
    }
  };
}
