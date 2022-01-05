import { observer } from 'mobx-react';
import { useContext } from 'react';

import ReactFlow, { MiniMap } from 'react-flow-renderer';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { PluginStoreContext } from 'renderer/contexts/PluginStore';

const Flow = () => {
  const noteStore = useContext(NodeStoreContext);
  const pluginStore = useContext(PluginStoreContext);

  return (
    <div
      className="reactflow-wrapper flex-fill"
      ref={(ref) => (noteStore.reactFlowWrapper = ref)}
    >
      {!pluginStore.loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          nodeTypes={noteStore.nodeTypes}
          elements={noteStore.elements}
          onLoad={noteStore.onLoad}
          onElementsRemove={noteStore.onElementsRemove}
          onElementClick={noteStore.onElementClick}
          onConnect={noteStore.onConnect}
          selectNodesOnDrag={false}
          onDrop={noteStore.onDrop}
          onDragOver={noteStore.onDragOver}
          onNodeContextMenu={noteStore.onDragOver}
        >
          <MiniMap
            className="minimap"
            nodeStrokeColor={(_n) => '#666'}
            nodeColor={(_n) => '#EEE'}
          />
        </ReactFlow>
      )}
    </div>
  );
};

export default observer(Flow);
