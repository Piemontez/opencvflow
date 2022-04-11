import { CVFComponent, CVFIOComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Mat, Point } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import { Position } from 'react-flow-renderer/nocss';
import { SourceHandle, TargetHandle } from 'renderer/types/handle';
import GCStore from 'renderer/contexts/GCStore';
import messages from '../messages';

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
      const { inputsAsMat: inputs } = this;

      if (inputs.length) {
        this.sources = [];
        for (const src of inputs) {
          if (src.channels() > 1) {
            throw new Error(
              messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace(
                '{1}',
                src.channels().toString()
              )
            );
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
    static properties = [{ name: 'display', type: PropertyType.Decimal }];

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
    static properties = [{ name: 'thresh', type: PropertyType.Decimal }];

    thresh: number = 3;

    async proccess() {
      const { inputs } = this;
      if (inputs.length === 2) {
        const [src, seed] = inputs;

        if (!src || !seed) {
          return;
        }

        const out = new cv.Mat(
          (src as Mat).rows,
          (src as Mat).cols,
          cv.CV_16U,
          new cv.Scalar(0)
        );
        GCStore.add(out);

        let toVisited = [] as Array<Point>;
        // Seed é do tipo Array<Point>
        if (Array.isArray(seed)) {
          toVisited = ([] as Array<Point>).concat(seed as Array<Point>);
          let label = 1;
          for (const sd of toVisited) {
            out.ushortPtr(sd.x && sd.y)[0] = label++;
          }
        }
        // Seed é do tipo Point
        else if ((seed as Point).x && (seed as Point).y) {
          out.ushortPtr((seed as Point).x && (seed as Point).y)[0] = 1;
          toVisited.push(seed as Point);
        }
        // Seed é do tipo Mat
        else if ((seed as Mat).cols && (seed as Mat).rows) {
          if (
            (src as Mat).rows !== (seed as Mat).rows &&
            (src as Mat).cols !== (seed as Mat).cols
          ) {
            throw new Error(messages.INPUTS_SAME_SIZES);
          }
          if ((seed as Mat).channels() > 1) {
            throw new Error(
              messages.CHANNELS_REQUIRED_ONLY.replace('{0}', '1').replace(
                '{1}',
                (seed as Mat).channels().toString()
              )
            );
          }

          let label = 1;
          for (let j = (src as Mat).rows - 1; j > -1; j--) {
            for (let k = (src as Mat).cols - 1; k > -1; k--) {
              if ((seed as Mat).ptr(j, k)[0]) {
                out.ushortPtr(j, k)[0] = label++;
                toVisited.push(new cv.Point(j, k));
              }
            }
          }
        }

        let next = toVisited.pop();
        while (next) {
          if (out.rows < next!.x || out.cols < next!.y) {
            next = toVisited.pop();
            continue;
          }

          const label = out.ushortAt(next!.x, next!.y);
          const center = (src as Mat).ptr(next!.x, next!.y)[0];
          const roi = new cv.Rect(
            next!.x ? next!.x - 1 : 0,
            next!.y ? next!.y - 1 : 0,
            out.rows - next!.x > 3 ? 3 : out.rows - next!.x,
            out.cols - next!.y > 3 ? 3 : out.cols - next!.y
          );

          for (let j = roi.x + roi.width; j > roi.x; j--) {
            for (let k = roi.y + roi.height; k > roi.y; k--) {
              const isVisited = out.ushortAt(j, k);
              if (!isVisited) {
                const value = (src as Mat).ptr(j, k)[0];
                if (Math.abs(center - value) >= this.thresh) {
                  out.ushortPtr(j, k)[0] = label;
                  toVisited.push(new cv.Point(j, k));
                }
              }
            }
          }
          next = toVisited.pop();
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
