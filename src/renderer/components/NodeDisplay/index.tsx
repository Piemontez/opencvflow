import { CVFComponent } from 'renderer/types/component';

const NodeDisplay = ({
  canvasRef,
  component,
}: {
  canvasRef: (ref: HTMLCanvasElement) => void;
  component: CVFComponent;
}) => {
  const { data } = component.props;
  if (data.errorMessage)
    return <div className="node-display">{data.errorMessage}</div>;

  return <canvas ref={canvasRef} width="640" height="480" />;
};

export default NodeDisplay;
