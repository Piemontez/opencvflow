import { CVFOutputComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { MorphShapes } from 'opencv-ts/src/ImageProcessing/ImageFiltering';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { NodeSizes } from '../../../core/config/sizes';
import { cvInputTabName } from './tabname';


export class CVStructuringElementComponent extends CVFOutputComponent {
  static menu = { tabTitle: cvInputTabName, title: 'StructuringElement' };

  static processor = class StructuringElementProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'type', type: PropertyType.Integer },
      { name: 'rows', type: PropertyType.Integer },
      { name: 'cols', type: PropertyType.Integer },
    ];

    type: MorphShapes = cv.MORPH_RECT;
    rows: number = 15;
    cols: number = 15;
    kernel: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    out: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);

    async start() {
      this.buildKernel(this.rows, this.cols, this.type);
    }

    async propertyChange(name: string, value: any): Promise<void> {
      this.buildKernel(
        name === 'rows' ? (value as number) : this.rows,
        name === 'cols' ? (value as number) : this.cols,
        name === 'type' ? (value as MorphShapes) : this.type
      );
    }

    buildKernel(rows: number, cols: number, type: MorphShapes) {
      GCStore.add(this.kernel, -100);
      GCStore.add(this.out, -100);

      this.kernel = cv.getStructuringElement(type, new cv.Size(this.cols, this.rows), new cv.Point(this.cols / 2, this.rows / 2));

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const outCols = cols * scale;
      const outRows = rows * scale;

      this.out = new cv.Mat(outRows, outCols, this.kernel.type());
      const dsize = new cv.Size(outCols, outRows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_LINEAR);

      for (let j = 0; j < outCols; j++) {
        for (let k = 0; k < outRows; k++) {
          this.out.charPtr(k, j)[0] = this.out.charPtr(k, j)[0] ? 255 : 0;
        }
      }
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}
