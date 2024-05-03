import { CVFComponent } from '.';
import { NodeSizes } from '../../../core/config/sizes';
import { MouseEventHandler } from 'react';

type NodeDisplayProps = {
  canvasRef: (ref: HTMLCanvasElement) => void;
  component: CVFComponent;
  onMouseMove: MouseEventHandler;
  onMouseLeave: () => void;
};

const NodeDisplay = ({ canvasRef, component, onMouseMove, onMouseLeave }: NodeDisplayProps) => {
  if (component?.props) {
    const { data } = component.props;
    const { processor } = data;
    if (processor.errorMessage) {
      return <div className="node-error-msg">{processor.errorMessage}</div>;
    }
  }

  return (
    <canvas ref={canvasRef} width={NodeSizes.defaultWidth} height={NodeSizes.defaultHeight} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} />
  );
};

export const NodeZoom = ({
  canvasRef,
  pos,
  scale,
}: {
  canvasRef: (ref: HTMLCanvasElement) => void;
  pos: { x: number; y: number };
  scale: number;
}) => {
  return (
    <div style={{ marginLeft: 50 + pos.x * scale, top: 75 + pos.y * scale, position: 'absolute', border: '1px solid' }}>
      <canvas ref={canvasRef} height={NodeSizes.defaultHeight} />
    </div>
  );
};

export default NodeDisplay;
