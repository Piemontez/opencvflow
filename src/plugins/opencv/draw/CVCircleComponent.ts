import cv, { Mat, Point, Scalar } from 'opencv-ts';
import { LineTypes } from 'opencv-ts/src/ImageProcessing/DrawingFunctions';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/components/NodeComponent';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { PropertyType } from '../../../ide/types/PropertyType';
import { drawTabName } from './tabname';


export class CVCircleComponent extends CVFComponent {
  static menu = { tabTitle: drawTabName, title: 'Circle' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'center', position: Position.Left },
    { title: 'radius', position: Position.Left },
    { title: 'rows', position: Position.Left },
    { title: 'cols', position: Position.Left },
    { title: 'type', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'drawed', position: Position.Right }];

  static processor = class CircleProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'center', type: PropertyType.Point },
      { name: 'radius', type: PropertyType.Integer },
      { name: 'color', type: PropertyType.Scalar },
    ];

    center: Point = new cv.Point(-1, -1);
    radius: number = 0;

    color: Scalar = new cv.Scalar(0, 0, 0);
    thickness: number = cv.FILLED;
    lineType: LineTypes = cv.LINE_AA;
    shift: number = 0;

    async proccess() {
      const { inputs } = this;
      let [, center, radius] = inputs;
      const [src, , , rows, cols, type] = inputs;

      let out: Mat | undefined;
      if (!src && rows && cols) {
        out = GCStore.add(new cv.Mat(rows as number, cols as number, type as number, this.color));
      } else if (src) {
        out = GCStore.add((src as Mat).clone());
      }

      if (!center) {
        if (this.center.x > -1) {
          center = this.center;
        } else if ((src as Mat)?.cols) {
          center = new cv.Point((src as Mat).cols / 2, (src as Mat).rows / 2);
        }
      }
      if (!radius) {
        radius = this.radius;
      }

      if (out && center && radius) {
        cv.circle(out, center as Point, radius as number, this.color, this.thickness, this.lineType, this.shift);

        this.sources = [out];
        this.output(out);
      }
    }
  };
}
