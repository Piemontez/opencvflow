import { CVFComponent } from '../../../ide/components/NodeComponent';
import { CVFComponentOptions } from '../../../ide/components/NodeComponent/CVFComponentOptions';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { Position } from 'reactflow';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { ContourApproximationModes, RetrievalModes } from 'opencv-ts/src/ImageProcessing/Shape';
import { edgeTabName } from './tabname';

/**
 * FindContours component and node
 */

export class FindContoursComponent extends CVFComponent {
  static menu = { tabTitle: edgeTabName, title: 'Find Contours' };
  targets: TargetHandle[] = [{ title: 'src', position: Position.Left }];
  sources: SourceHandle[] = [
    { title: 'contours', position: Position.Right },
    { title: 'hierarchy', position: Position.Right },
  ];

  componentDidMount() {
    this.addOption(CVFComponentOptions.NOT_DISPLAY);
  }

  static processor = class FindContoursNode extends CVFNodeProcessor {
    properties = [
      { name: 'mode', type: PropertyType.Integer },
      { name: 'method', type: PropertyType.Integer },
    ];

    mode: RetrievalModes = cv.RETR_TREE;
    method: ContourApproximationModes = cv.CHAIN_APPROX_SIMPLE;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        const [src] = inputs;
        if (!src) return;

        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        GCStore.add(contours);
        GCStore.add(hierarchy);

        cv.findContours(src, contours, hierarchy, this.mode, this.method);

        this.sources = [contours, hierarchy];
      } else {
        this.sources = [];
      }
    }
  };
}
