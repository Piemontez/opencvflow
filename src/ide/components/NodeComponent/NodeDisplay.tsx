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
}: {
  canvasRef: (ref: HTMLCanvasElement) => void;
  pos: { mx: number; my: number; canvasScale: number };
}) => {
  return (
    <div
      style={{
        marginLeft: 150 + pos.mx * pos.canvasScale,
        top: 20 + pos.my * pos.canvasScale,
        position: 'absolute',
      }}
    >
      <div className="node-body">
        <canvas ref={canvasRef} height={NodeSizes.defaultHeight} />
      </div>
    </div>
  );
};

export default NodeDisplay;
