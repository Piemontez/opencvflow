import cv, { Mat } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { arithmeticTabName } from './tabname';


export class CVBitwiseAndComponent extends CVFComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Bitwise And' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
    { title: 'masc', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class BitwiseAndProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length < 2) {
        this.sources = [];
        return;
      }
      const [src1, src2, masc] = inputs;

      if (src1 && src2) {
        const out: Mat = new cv.Mat(src1.rows, src1.cols, src1.type(), new cv.Scalar(0));
        GCStore.add(out);

        if (masc) {
          cv.bitwise_and(src1, src2, out, masc);
        } else if (inputs.length === 2) {
          cv.bitwise_and(src1, src2, out);
        }

        this.output(out);
        this.sources = [out];
      }
    }
  };
}
