import cv, { Point } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'reactflow';
import { CVFComponentOptions, CVFIOComponent } from '../../../ide/types/component';
import { SourceHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { cvUtilsTabName } from './tabname';


export class ContoursCentersComponent extends CVFIOComponent {
  static menu = { tabTitle: cvUtilsTabName, title: 'Contours Centers' };

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
