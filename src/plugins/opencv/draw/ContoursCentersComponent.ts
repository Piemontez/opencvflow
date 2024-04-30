import cv from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'reactflow';
import { CVFComponentOptions, CVFIOComponent } from '../../../ide/types/component';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { drawTabName } from './tabname';


export class ContoursCentersComponent extends CVFIOComponent {
  static menu = { tabTitle: drawTabName, title: 'Contours Centers' };
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
