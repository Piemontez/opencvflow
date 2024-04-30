import cv, { Mat, Point, Scalar } from 'opencv-ts';
import { LineTypes } from 'opencv-ts/src/ImageProcessing/DrawingFunctions';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { drawTabName } from './tabname';


export class CVRectangleComponent extends CVFComponent {
  static menu = { tabTitle: drawTabName, title: 'Rectangle' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'point1', position: Position.Left },
    { title: 'point2', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'drawed', position: Position.Right }];

  static processor = class RectangleProcessor extends CVFNodeProcessor {
    color: Scalar = new cv.Scalar(100, 100, 100);
    thickness: number = 1;
    lineType: LineTypes = cv.LINE_AA;
    shift: number = 0;

    async proccess() {
      const { inputs } = this;
      if (inputs.length === 3) {
        const [src, point1, point2] = inputs;

        if (src && point1 && point2) {
          const out = (src as Mat).clone();
          GCStore.add(out);

          cv.rectangle(out, point1 as Point, point2 as Point, this.color, this.thickness, this.lineType, this.shift);

          this.sources = [out];
          this.output(out);
        }
      }
    }
  };
}
