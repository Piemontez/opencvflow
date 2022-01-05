import { observer } from 'mobx-react';
import { useContext } from 'react';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { CVFNodeProcessor } from 'renderer/types/node';

const PropertyBar = () => {
  const noteStore = useContext(NodeStoreContext);
  const curElTypeof = noteStore.currentElement?.data
    ?.constructor as typeof CVFNodeProcessor;

  return (
    <div className="propertybar">
      <h1 className="header">
      {curElTypeof?.name} Props
      </h1>
      {curElTypeof?.properties?.map((prop) => (
        <span>
          {prop.name}
          {prop.type}
          <br/>
        </span>
      ))}
    </div>
  );
};

export default observer(PropertyBar);
