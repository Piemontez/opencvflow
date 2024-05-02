import cv, { Mat, MatVector } from 'opencv-ts';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponent } from '../../../ide/components/NodeComponent';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { drawTabName } from './tabname';


export class DrawContourComponent extends CVFComponent {
  static menu = { tabTitle: drawTabName, title: 'Draw Contour' };

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
            cv.drawContours(out, contours as MatVector, i, new cv.Scalar(250, 100, 50), 5);
          }
          this.sources = [out];
          this.output(out);
        }
      }
    }
  };
}
