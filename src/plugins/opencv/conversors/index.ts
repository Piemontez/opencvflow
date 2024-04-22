import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { ColorConversionCodes } from 'opencv-ts/src/core/ColorConversion';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import GCStore from '../../../core/contexts/GCStore';

const tabName = ['OpenCV', 'Conversors'];

/**
 * CvtColor component and node
 */
export class CvtColorComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'CvtColor' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    properties = [
      { name: 'code', type: PropertyType.ColorConversionCodes },
      { name: 'dstCn', type: PropertyType.Integer },
    ];

    code: ColorConversionCodes = cv.COLOR_BGR2GRAY;
    dstCn: number = 0;

    async proccess() {
      const { inputsAsMat } = this;
      this.sources = [];
      for (const src of inputsAsMat) {
        if (!src) continue;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        cv.cvtColor(src, out, this.code, this.dstCn);

        this.sources.push(out);
        this.output(out);
      }
    }
  };
}

/**
 * ConverTo component and node
 */
export class ConverToComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'ConverTo' };
  static processor = class ConverToNode extends CVFNodeProcessor {
    properties = [
      { name: 'rtype', type: PropertyType.DataTypes },
      { name: 'alpha', type: PropertyType.Decimal },
      { name: 'beta', type: PropertyType.Decimal },
    ];

    rtype: DataTypes = cv.CV_8U;
    alpha: number = 1;
    beta: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, src.type());
          GCStore.add(out);

          src.convertTo(out, this.rtype, this.alpha, this.beta);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}
