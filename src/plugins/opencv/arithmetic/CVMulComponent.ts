import { Mat } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFIOEndlessComponent } from '../../../ide/types/component';
import { TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { arithmeticTabName } from './tabname';


export class CVMulComponent extends CVFIOEndlessComponent {
  static menu = { tabTitle: arithmeticTabName, title: 'Mul' };
  targets: TargetHandle[] = [
    { title: 'src1', position: Position.Left },
    { title: 'src2', position: Position.Left },
  ];

  static processor = class MulProcessor extends CVFNodeProcessor {
    async proccess() {
      let out: Mat | null = null;

      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!out) {
            out = src.clone();
            GCStore.add(out);
          } else {
            out = out.mul(src);
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
