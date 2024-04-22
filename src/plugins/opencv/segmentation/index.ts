import { CVFComponent, CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat, Point } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import { Position } from 'reactflow';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import GCStore from '../../../core/contexts/GCStore';
import messages from '../messages';

const tabName = ['OpenCV', 'Segmentation'];

/**
 * Threshold component and node
 */
export class ThresholdComponent extends CVFIOComponent {
  static menu = { tabTitle: tabName, title: 'Threshold' };

  static processor = class ThresholdNode extends CVFNodeProcessor {
    properties = [
      { name: 'thresh', type: PropertyType.Decimal },
      { name: 'maxval', type: PropertyType.Decimal },
      { name: 'type', type: PropertyType.ThresholdTypes },
    ];

    thresh: number = 0;
    maxval: number = 255;
    type: ThresholdTypes = cv.THRESH_BINARY_INV + cv.THRESH_OTSU;

    async proccess() {
      const { inputsAsMat: inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (src.channels() > 1) {
            throw new Error(messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace('{1}', src.channels().toString()));
          }
          const out = new cv.Mat(src.rows, src.cols, cv.CV_8U);
          GCStore.add(out);

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

  static processor = class ConnectedComponentsNode extends CVFNodeProcessor {
    properties = [{ name: 'display', type: PropertyType.Decimal }];

    display: number = 0;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          const out = new cv.Mat();
          GCStore.add(out);

          cv.connectedComponents(src, out);

          this.sources.push(out);
          this.output(out);
        }
      }
    }
  };
}

/**
 * RegionGrowing component and node
 */
export class RegionGrowing extends CVFComponent {
  static menu = { tabTitle: tabName, title: 'Region Growing' };
  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'seed', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class RegionGrowingNode extends CVFNodeProcessor {
    properties = [
      { name: 'alert', type: PropertyType.Label },
      { name: 'thresh', type: PropertyType.Decimal },
    ];

    alert: string = 'This is an experimental operator';
    thresh: number = 7;

    async proccess() {
      const { inputs } = this;
      if (inputs.length === 2) {
        const [src, seed] = inputs;

        if (!src || !seed) {
          return;
        }

        const out = new cv.Mat((src as Mat).rows, (src as Mat).cols, cv.CV_16U, new cv.Scalar(0));
        GCStore.add(out);

        const neighborhood: Array<Array<Point>> = [];
        // Seed é do tipo Array<Point>
        if (Array.isArray(seed)) {
          let label = 1;
          for (const sd of seed as Array<Point>) {
            neighborhood.push([sd]);
            out.ushortPtr(sd.y, sd.x)[0] = label++;
          }
        }
        // Seed é do tipo Point
        else if ((seed as Point).x && (seed as Point).y) {
          out.ushortPtr((seed as Point).y && (seed as Point).x)[0] = 1;
          neighborhood.push([seed as Point]);
        }
        // Seed é do tipo Mat
        else if ((seed as Mat).cols && (seed as Mat).rows) {
          if ((src as Mat).rows !== (seed as Mat).rows && (src as Mat).cols !== (seed as Mat).cols) {
            throw new Error(messages.INPUTS_SAME_SIZES);
          }
          if ((seed as Mat).channels() > 1) {
            throw new Error(messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace('{1}', (seed as Mat).channels().toString()));
          }

          let label = 1;
          for (let row = (src as Mat).rows - 1; row > -1; row--) {
            for (let col = (src as Mat).cols - 1; col > -1; col--) {
              if ((seed as Mat).ptr(row, col)[0]) {
                out.ushortPtr(row, col)[0] = label++;
                neighborhood.push([new cv.Point(col, row)]);
              }
            }
          }
        }

        let neighbors = neighborhood.shift();
        while (neighbors) {
          const toVisit = [] as Array<Point>;

          let nextNb = neighbors.pop();
          let center = 0;
          while (nextNb) {
            if (out.rows < nextNb!.y || out.cols < nextNb!.x) {
              nextNb = neighbors.pop();
              continue;
            }
            if (!center) {
              center = (src as Mat).ptr(nextNb!.y, nextNb!.y)[0];
            }
            const label = out.ushortAt(nextNb!.y, nextNb!.x);
            const roi = new cv.Rect(
              nextNb!.x ? nextNb!.x - 1 : 0,
              nextNb!.y ? nextNb!.y - 1 : 0,
              out.cols - nextNb!.x > 3 ? 3 : out.cols - nextNb!.x,
              out.rows - nextNb!.y > 3 ? 3 : out.rows - nextNb!.y,
            );

            for (let row = roi.y + roi.height - 1; row >= roi.y; row--) {
              for (let col = roi.x + roi.width - 1; col >= roi.x; col--) {
                const isVisited = out.ushortAt(row, col);
                if (!isVisited) {
                  const value = (src as Mat).ptr(row, col)[0];
                  if (Math.abs(center - value) <= this.thresh) {
                    if (label) {
                      out.ushortPtr(row, col)[0] = label;
                      neighbors.push(new cv.Point(col, row));
                    }
                  } else {
                    //toVisit.push(new cv.Point(row, col));
                  }
                }
              }
            }
            nextNb = neighbors.pop();
          }
          if (toVisit.length) {
            neighborhood.push(toVisit);
          }
          neighbors = neighborhood.shift();
        }

        this.output(out);
        this.sources = [out];
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

  static processor = class WatershedNode extends CVFNodeProcessor {
    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length === 2) {
        const [src, markers] = inputs;
        const out = markers.clone();
        GCStore.add(out);

        cv.watershed(src, out);

        this.output(out);
        this.sources = [out];
      }
    }
  };
}
