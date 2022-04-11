import cv, { Mat, MatVector } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'react-flow-renderer/nocss';
import GCStore from 'renderer/contexts/GCStore';
import {
  CVFComponent,
  CVFComponentOptions,
  CVFIOComponent,
} from 'renderer/types/component';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import { CVFNodeProcessor } from 'renderer/types/node';

const tabName = 'Draw';

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
              new cv.Scalar(255, 255, 255),
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
