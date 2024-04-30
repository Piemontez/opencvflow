import { XYPosition } from 'reactflow';
import { NodeSizes } from '../../core/config/sizes';

export const makeXYPosition = (gridX: number, gridY: number, padding?: number): XYPosition => {
  if (padding === undefined) {
    padding = NodeSizes.defaultWidth / 3;
  }
  return {
    x: (NodeSizes.defaultWidth + padding) * gridX,
    y: (NodeSizes.defaultHeight + padding) * gridY,
  };
};
