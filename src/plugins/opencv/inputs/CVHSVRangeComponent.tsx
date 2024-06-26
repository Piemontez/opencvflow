import { CVFComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { Position } from 'reactflow';
import { SourceHandle } from '../../../core/types/handle';
import { inputTabName } from './tabname';
import { PropertyType } from '../../../ide/types/PropertyType';
import { NodeSizes } from '../../../core/config/sizes';

/**
 * Video Capture component and node
 */
export class CVHSVRangeComponent extends CVFComponent {
  static menu = {
    tabTitle: inputTabName,
    title: 'HSV Range',
  };

  sources: SourceHandle[] = [
    { title: 'min', position: Position.Right },
    { title: 'max', position: Position.Right },
  ];

  static processor = class HSVRangeProcessor extends CVFNodeProcessor {
    canvas: HTMLCanvasElement | null = null;
    canvasEnd: HTMLCanvasElement | null = null;

    properties = [
      { name: 'hueMin', type: PropertyType.Integer },
      { name: 'hueMax', type: PropertyType.Integer },
      { name: 'saturationMin', type: PropertyType.Integer },
      { name: 'saturationMax', type: PropertyType.Integer },
      { name: 'valueMin', type: PropertyType.Integer },
      { name: 'valueMax', type: PropertyType.Integer },
    ];

    hueMin: number = 120;
    hueMax: number = 140;
    saturationMin: number = 120;
    saturationMax: number = 140;
    valueMin: number = 120;
    valueMax: number = 140;

    body() {
      return (
        <>
          aa
          <canvas width={NodeSizes.defaultWidth} height={NodeSizes.defaultHeight} ref={(ref) => (this.canvas = ref)} />
          bb
          <canvas width={NodeSizes.defaultWidth} height={NodeSizes.defaultHeight} ref={(ref) => (this.canvasEnd = ref)} />
          cc
        </>
      );
    }

    async propertyChange(): Promise<void> {
      this.repaintCanvas();
    }

    repaintCanvas() {
      for (let h = this.hueMin; h < this.hueMax; h++) {
        for (let s = this.saturationMin; s < this.saturationMax; s++) {}
      }
    }

    async proccess() {
      const min = cv.matFromArray(1, 3, cv.CV_8U, [this.hueMin, this.saturationMin, this.valueMin]);
      const max = cv.matFromArray(1, 3, cv.CV_8U, [this.hueMin, this.saturationMin, this.valueMin]);

      this.sources = [min, max];
    }
  };
}
