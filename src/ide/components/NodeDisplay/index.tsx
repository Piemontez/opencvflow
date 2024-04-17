import { CVFComponent } from '../../types/component';
import { NodeSizes } from '../../config/sizes';

const NodeDisplay = ({
  canvasRef,
  component,
}: {
  canvasRef: (ref: HTMLCanvasElement) => void;
  component: CVFComponent;
}) => {
  const { data } = component.props;
  const { processor } = data;
  if (processor.errorMessage) {
    return <div className="node-error-msg">{processor.errorMessage}</div>;
  }

  return (
    <canvas
      ref={canvasRef}
      width={NodeSizes.defaultWidth}
      height={NodeSizes.defaultHeight}
    />
  );
};

export default NodeDisplay;
