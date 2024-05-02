import { CVFOutputComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { NodeSizes } from '../../../core/config/sizes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inputTabName } from './tabname';

export class CVKernelComponent extends CVFOutputComponent {
  static menu = {
    tabTitle: inputTabName,
    name: 'kernel',
    title: (
      <>
        <FontAwesomeIcon icon={'table-cells'} /> Kernel
      </>
    ),
  };

  static processor = class KernelProcessor extends CVFNodeProcessor {
    properties = [{ name: 'kernel', type: PropertyType.OneZeroMatrix }];

    kernel: Mat = new cv.Mat(3, 3, cv.CV_8U, new cv.Scalar(0));
    out: Mat = new cv.Mat(3, 3, cv.CV_8U, new cv.Scalar(0));

    async start() {
      this.makeOutput();
    }

    async propertyChange(name: string, _value: any): Promise<void> {
      if (name === 'kernel') {
        this.makeOutput();
      }
    }

    makeOutput() {
      GCStore.add(this.out, -100);

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const cols = this.kernel.cols * scale;
      const rows = this.kernel.rows * scale;

      this.out = new cv.Mat(rows, cols, this.kernel.type());
      const dsize = new cv.Size(cols, rows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_AREA);

      const channels = this.out.channels();
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < rows; k++) {
          for (let i = 0; i < channels; i++) {
            this.out.charPtr(k, j)[i] = this.out.charPtr(k, j)[i] ? 255 : 0;
          }
        }
      }
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}
