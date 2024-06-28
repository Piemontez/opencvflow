import { Position } from 'reactflow';
import { CVFIOComponent } from '../../ide/components/NodeComponent';
import { SourceHandle } from '../../core/types/handle';
import { CVFNodeProcessor } from '../../core/types/node';
import { cvUtilsTabName } from './tabname';

export class MapPropertiesComponent extends CVFIOComponent {
  static menu = { tabTitle: cvUtilsTabName, title: 'Map Properties' };

  sources: SourceHandle[] = [
    { title: 'out', position: Position.Right },
    { title: 'rows', position: Position.Right },
    { title: 'cols', position: Position.Right },
    { title: 'type', position: Position.Right },
    { title: 'channels', position: Position.Right },
  ];

  static processor = class ContoursCentersProcessor extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat } = this;
      if (inputsAsMat.length) {
        const [src] = inputsAsMat;

        this.sources = [src, src.rows, src.cols, src.type(), src.channels()];
      }
    }
  };
}
