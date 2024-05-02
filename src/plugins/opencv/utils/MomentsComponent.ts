import cv, { Mat, MatVector } from 'opencv-ts';
import { Moments } from 'opencv-ts/src/core/Moments';
import { Position } from 'reactflow';
import GCStore from '../../../core/contexts/GCStore';
import { CVFComponentOptions, CVFIOComponent } from '../../../ide/components/NodeComponent';
import { SourceHandle } from '../../../core/types/handle';
import { CVFNodeProcessor } from '../../../core/types/node';
import { cvUtilsTabName } from './tabname';

export class MomentsComponent extends CVFIOComponent {
  static menu = { tabTitle: cvUtilsTabName, title: 'Moments' };

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
