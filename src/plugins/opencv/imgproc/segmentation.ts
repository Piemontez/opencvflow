import { CVFComponent, CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import { Position } from 'react-flow-renderer';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';

const tabName = 'Segmentation';

/**
 * Threshold component and node
 */
export class ThresholdComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Threshold' };
  static processor = class ThresholdNode extends CVFNodeProcessor {
    static properties = [
      { name: 'thresh', type: PropertyType.Decimal },
      { name: 'maxval', type: PropertyType.Decimal },
      { name: 'type', type: PropertyType.ThresholdTypes },
    ];

    thresh: number = 0;
    maxval: number = 255;
    type: ThresholdTypes = cv.THRESH_BINARY_INV + cv.THRESH_OTSU;

    async proccess() {
      const { inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat(src.rows, src.cols, cv.CV_8U);
          cv.threshold(src, out, this.thresh, this.maxval, this.type);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Threshold component and node
 */
export class ConnectedComponentsComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Connected Components' };
  static processor = class CvtColorNode extends CVFNodeProcessor {
    static properties = [{ name: 'display', type: PropertyType.Decimal }];

    display: number = 0;

    async proccess() {
      const { inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat();
          cv.connectedComponents(src, out);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * Watershed component and node
 */
export class WatershedComponent extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Watershed' };
  targets: TargetHandle[] = [
    { title: 'image', position: Position.Left },
    { title: 'markers', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class Filter2DNode extends CVFNodeProcessor {
    async proccess() {
      const { inputs } = this;
      if (inputs.length === 2) {
        const [src, markers] = inputs;

        cv.watershed(src, markers);

        this.output(markers);
        this.sources = [markers];
      }
    }
  };
}
