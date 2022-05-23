import cv, { Mat, MatVector, Point, Scalar } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { LineTypes } from 'opencv-ts/src/ImageProcessing/DrawingFunctions';
import { Position } from 'react-flow-renderer/nocss';
import GCStore from 'renderer/contexts/GCStore';
import {
  CVFComponent,
  CVFComponentOptions,
  CVFIOComponent,
} from 'renderer/types/component';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { CVFNodeProcessor } from 'renderer/types/node';
import { PropertyType } from 'renderer/types/property';

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
  ];
  sources: SourceHandle[] = [{ title: 'drawed', position: Position.Right }];

  static processor = class CircleProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'center', type: PropertyType.Point },
      { name: 'radius', type: PropertyType.Integer },
    ];

    center: Point = new cv.Point(-1, -1);
    radius: number = 0;

    color: Scalar = new cv.Scalar(100, 100, 100);
    thickness: number = 1;
    lineType: LineTypes = cv.FILLED;
    shift: number = 0;

    async proccess() {
      const { inputs } = this;
      let [src, center, radius] = inputs;

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

      if (src && center && radius) {
        const out = (src as Mat).clone();
        GCStore.add(out);

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
          const out = (src as Mat).clone();
          GCStore.add(out);
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
