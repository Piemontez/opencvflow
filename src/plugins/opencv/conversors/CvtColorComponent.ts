import { CVFIOComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { ColorConversionCodes } from 'opencv-ts/src/core/ColorConversion';
import GCStore from '../../../core/contexts/GCStore';
import { conversorsTabName } from './tabname';
import { SourceHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';

/**
 * CvtColor component and node
 */

export class CvtColorComponent extends CVFIOComponent {
  static menu = { tabTitle: conversorsTabName, title: 'CvtColor' };
  sources: SourceHandle[] = [
    { title: 'out', position: Position.Right },
    { title: 'type', position: Position.Right },
  ];

  static processor = class CvtColorNode extends CVFNodeProcessor {
    properties = [
      { name: 'code', type: PropertyType.ColorConversionCodes },
      { name: 'dstCn', type: PropertyType.Integer },
    ];

    code: ColorConversionCodes = cv.COLOR_BGR2GRAY;
    dstCn: number = 0;

    async proccess() {
      const { inputsAsMat } = this;
      const [src] = inputsAsMat;

      if (!src) {
        this.sources = [];
        return;
      }

      const out = new cv.Mat(src.rows, src.cols, src.type());
      GCStore.add(out);

      cv.cvtColor(src, out, this.code, this.dstCn);

      this.sources = [out, out.type()];
      this.output(out);
    }
  };
}
