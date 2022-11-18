import { observer } from 'mobx-react';
import { useContext } from 'react';

import ReactFlow, { MiniMap } from 'react-flow-renderer/nocss';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { PluginStoreContext } from 'renderer/contexts/PluginStore';
import Controls from './controls';

const Flow = () => {
  const noteStore = useContext(NodeStoreContext);
  const pluginStore = useContext(PluginStoreContext);

  // Fix: Forçar atualização do ReactFlow porque o mesmo não faz reload dos nodeTypes
  if (noteStore.forcer & 1) {
    return null;
  }

  return (
    <div
      className="reactflow-wrapper flex-fill"
      ref={(ref) => (noteStore.reactFlowWrapper = ref)}
    >
      <span style={{ display: 'none' }}>{noteStore.forcer}</span>

      <Controls />

      {!pluginStore.loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          defaultZoom={0.8}
          minZoom={0.1}
          nodeTypes={noteStore.nodeTypes}
          elements={noteStore.elements}
          selectNodesOnDrag={false}
          onLoad={noteStore.onLoad}
          onElementsRemove={noteStore.onElementsRemove}
          onElementClick={noteStore.onElementClick}
          onConnect={noteStore.onConnect}
          onDrop={noteStore.onDrop}
          onDragOver={noteStore.onDragOver}
          onNodeContextMenu={noteStore.onDragOver}
          onNodeDragStop={noteStore.onNodeDragStop}
        >
          <MiniMap
            className="minimap"
            nodeStrokeColor={(_n) => '#333'}
            nodeColor={(_n) => '#DDD'}
          />
        </ReactFlow>
      )}
    </div>
  );
};

export default observer(Flow);
