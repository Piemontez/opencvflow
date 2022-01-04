import { CVFComponent } from 'renderer/types/component';

const NodeDisplay = ({ component }: { component: CVFComponent }) => {
  return (
    <div className="node-display">
      {component.title}
    </div>
  );
};

export default NodeDisplay;
