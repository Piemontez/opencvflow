import { CVFOutputComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { NodeSizes } from '../../../core/config/sizes';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import { cvInputTabName } from './tabname';


export class CVMatComponent extends CVFOutputComponent {
  static menu = { tabTitle: cvInputTabName, title: 'Mat' };

  static processor = class MatProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'dataType', type: PropertyType.DataTypes },
      { name: 'kernel', type: PropertyType.IntMatrix },
    ];

    dataType: DataTypes = cv.CV_8U;
    kernel: Mat = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));
    out: Mat = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));

    async start() {
      this.makeOutput();
    }

    async propertyChange(name: string, value: any): Promise<void> {
      if (name === 'dataType') {
        this.changeDataType(value as number);
      } else if (name === 'kernel') {
        this.makeOutput();
      }
    }

    changeDataType(value: number) {
      GCStore.add(this.kernel, -100);

      const newKernel = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));

      this.kernel.convertTo(newKernel, value);
      this.kernel = newKernel;

      const isUType = [cv.CV_8UC1, cv.CV_8UC2, cv.CV_8UC3, cv.CV_8UC4].includes(value);

      if (isUType) {
        this.properties[1].type = PropertyType.IntMatrix;
      } else {
        this.properties[1].type = PropertyType.DoubleMatrix;
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

      const isUType = [cv.CV_8UC1, cv.CV_8UC2, cv.CV_8UC3, cv.CV_8UC4].includes(this.kernel.type() as number);

      if (isUType) {
        const channels = this.out.channels();
        for (let j = 0; j < cols; j++) {
          for (let k = 0; k < rows; k++) {
            for (let i = 0; i < channels; i++) {
              this.out.charPtr(k, j)[i] = this.out.charPtr(k, j)[i] ? 255 : 0;
            }
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
