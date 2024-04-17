import cv, { Mat, MatVector, Point, Scalar } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { LineTypes } from 'opencv-ts/src/ImageProcessing/DrawingFunctions';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import {
  CVFComponent,
  CVFComponentOptions,
  CVFIOComponent,
} from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { PropertyType } from '../../../ide/types/PropertyType';

const tabName = 'Draw';

export class CVRectangleComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Rectangle' };

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

          cv.rectangle(
            out,
            point1 as Point,
            point2 as Point,
            this.color,
            this.thickness,
            this.lineType,
            this.shift
          );

          this.sources = [out];
          this.output(out);
        }
      }
    }
  };
}

export class CVLineComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Line' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'point1', position: Position.Left },
    { title: 'point2', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'drawed', position: Position.Right }];

  static processor = class LineProcessor extends CVFNodeProcessor {
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

          cv.line(
            out,
            point1 as Point,
            point2 as Point,
            this.color,
            this.thickness,
            this.lineType,
            this.shift
          );

          this.sources = [out];
          this.output(out);
        }
      }
    }
  };
}

export class CVCircleComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Circle' };

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
        out = GCStore.add(
          new cv.Mat(rows as number, cols as number, type as number, this.color)
        );
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
        cv.circle(
          out,
          center as Point,
          radius as number,
          this.color,
          this.thickness,
          this.lineType,
          this.shift
        );

        this.sources = [out];
        this.output(out);
      }
    }
  };
}

export class DrawContourComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Draw Contour' };

  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'contours', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'drawed', position: Position.Right }];

  static processor = class DrawContourProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length === 2) {
        const [src, contours] = inputs;

        if ((contours as MatVector).size) {
          const out = GCStore.add((src as Mat).clone());

          for (let i = 0; i < (contours as MatVector).size(); ++i) {
            cv.drawContours(
              out,
              contours as MatVector,
              i,
              new cv.Scalar(250, 100, 50),
              5
            );
          }
          this.sources = [out];
          this.output(out);
        }
      }
    }
  };
}

export class ContoursCentersComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Contours Centers' };
  targets: TargetHandle[] = [{ title: 'contours', position: Position.Left }];
  sources: SourceHandle[] = [{ title: 'point', position: Position.Right }];

  componentDidMount() {
    this.addOption(CVFComponentOptions.NOT_DISPLAY);
  }

  static processor = class ContoursCentersProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (!src) return;

          const m = src as Moments;
          if (m.m00) {
            const cx = m.m10 / m.m00;
            const cy = m.m11 / m.m00;
            this.sources.push(new cv.Point(cx, cy));
          }
        }
      }
    }
  };
}
