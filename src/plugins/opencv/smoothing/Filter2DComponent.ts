import { CVFIOComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Point } from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import { BorderTypes } from 'opencv-ts/src/core/CoreArray';
import GCStore from '../../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { Position } from 'reactflow';
import { smoothingTabName } from './tabname';

/**
 * Filter2D component and node
 */

export class Filter2DComponent extends CVFIOComponent {
  static menu = { tabTitle: smoothingTabName, title: 'Filter2D' };
  targets: TargetHandle[] = [
    { title: 'src', position: Position.Left },
    { title: 'kernel', position: Position.Left },
  ];
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];

  static processor = class Filter2DNode extends CVFNodeProcessor {
    properties = [
      { name: 'ddepth', type: PropertyType.Integer },
      { name: 'anchor', type: PropertyType.Point },
      { name: 'delta', type: PropertyType.Decimal },
      { name: 'borderType', type: PropertyType.BorderType },
    ];

    ddepth: number = -1;
    anchor: Point = new cv.Point(-1, -1);
    delta: number = 0;
    borderType: BorderTypes = cv.BORDER_CONSTANT;

    async proccess() {
      const { inputsAsMat: inputs } = this;
      if (inputs.length === 2) {
        this.sources = [];
        const [src, kernel] = inputs;

        const out = new cv.Mat(src.rows, src.cols, src.type());
        GCStore.add(out);

        // Não é do mesmo tipo independente da quantidade de canais
        if (!((1 | 2 | 4) & kernel.type() & src.type())) {
          // Converte para o mesmo tipo porém com 1 canal só
          kernel.convertTo(kernel, src.type() & (1 | 2 | 4));
        }

        cv.filter2D(src, out, this.ddepth, kernel, this.anchor, this.delta, this.borderType);
        this.sources.push(out);
        this.output(out);
      }
    }
  };
}
