import { observer } from 'mobx-react';
import { useContext } from 'react';

import ReactFlow from 'react-flow-renderer';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { PluginStoreContext } from 'renderer/contexts/PluginStore';

const Body = () => {
  const noteStore = useContext(NodeStoreContext);
  const pluginStore = useContext(PluginStoreContext);

  return (
    <div
      className="reactflow-wrapper flex-fill"
      ref={noteStore.reactFlowWrapper}
    >
      {!pluginStore.loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          nodeTypes={noteStore.nodeTypes}
          elements={noteStore.elements}
          onLoad={noteStore.onLoad}
          onElementsRemove={noteStore.onElementsRemove}
          onConnect={noteStore.onConnect}
          selectNodesOnDrag={false}
          onDrop={noteStore.onDrop}
          onDragOver={noteStore.onDragOver}
          onNodeContextMenu={noteStore.onDragOver}
        />
      )}
    </div>
  );
};

export default observer(Body);
