import cv, { Mat, MatVector, Point } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'react-flow-renderer/nocss';
import GCStore from 'renderer/contexts/GCStore';
import { CVFComponentOptions, CVFIOComponent } from 'renderer/types/component';
import { SourceHandle } from 'renderer/types/handle';
import { CVFNodeProcessor } from 'renderer/types/node';

const tabName = 'Utils';

export class MomentsComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Moments' };

  sources: SourceHandle[] = [{ title: 'moments', position: Position.Right }];

  componentDidMount() {
    this.addOption(CVFComponentOptions.NOT_DISPLAY);
  }

  static processor = class ContoursCentersProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        const [src] = inputs;
        if ((src as MatVector).size) {
          const out = [] as Array<Moments>;
          for (let i = 0; i < (src as MatVector).size(); ++i) {
            const mat = (src as MatVector).get(i);
            GCStore.add(mat);

            out.push(cv.moments(mat));
          }
          this.sources.push(out);
        } else {
          this.sources.push(cv.moments(src as Mat));
        }
      }
    }
  };
}

export class ContoursCentersComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Contours Centers' };

  sources: SourceHandle[] = [{ title: 'points', position: Position.Right }];

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

          let ms: Array<Moments> = [];
          if (Array.isArray(src)) {
            ms = src as Array<Moments>;
          } else {
            ms = [src as Moments];
          }

          const out = [] as Array<Point>;
          for (const m of ms) {
            if (m.m00) {
              const cx = Math.floor(m.m10 / m.m00);
              const cy = Math.floor(m.m01 / m.m00);
              out.push(new cv.Point(cx, cy));
            }
          }
          this.sources = [out];
        }
      }
    }
  };
}
