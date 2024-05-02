import { CVFOutputComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { NodeSizes } from '../../../core/config/sizes';
import { cvInputTabName } from './tabname';

export class CVGaussianKernelComponent extends CVFOutputComponent {
  static menu = { tabTitle: cvInputTabName, title: 'GausKernel' };

  static processor = class GaussianKernelProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'sigma', type: PropertyType.Decimal },
      { name: 'rows', type: PropertyType.Integer },
      { name: 'cols', type: PropertyType.Integer },
    ];

    sigma: number = 1;
    rows: number = 5;
    cols: number = 5;
    kernel: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    out: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);

    async start() {
      this.buildKernel(this.rows, this.cols, this.sigma);
    }

    async propertyChange(name: string, value: any): Promise<void> {
      this.buildKernel(
        name === 'rows' ? (value as number) : this.rows,
        name === 'cols' ? (value as number) : this.cols,
        name === 'sigma' ? (value as number) : this.sigma
      );
    }

    buildKernel(rows: number, cols: number, sigma: number) {
      GCStore.add(this.kernel, -100);
      GCStore.add(this.out, -100);

      this.kernel = new cv.Mat(rows, cols, cv.CV_32F);

      const g1 = cv.getGaussianKernel(rows, sigma, cv.CV_32F);
      const g2 = cv.getGaussianKernel(cols, sigma, cv.CV_32F);
      cv.multiply(g1, g2.t(), this.kernel, 1);

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const outCols = cols * scale;
      const outRows = rows * scale;

      this.out = new cv.Mat(outRows, outCols, this.kernel.type());
      const dsize = new cv.Size(outCols, outRows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_AREA);
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}
