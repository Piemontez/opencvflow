import { useContext } from 'react';

import ReactFlow, { MiniMap } from 'reactflow';
import { NodeStoreContext } from '../../contexts/NodeStore';
import { PluginStoreContext } from '../../contexts/PluginStore';
import Controls from './controls';
import { CVFNode } from '../../types/node';
import { OCVFEdge } from '../../types/edge';

const Flow = () => {
  const noteStore = useContext(NodeStoreContext);
  const pluginStore = useContext(PluginStoreContext);

  // Fix: Forçar atualização do ReactFlow porque o mesmo não faz reload dos nodeTypes
  if (noteStore.forcer & 1) {
    return null;
  }

  return (
    <div className="reactflow-wrapper flex-fill" ref={(ref) => (noteStore.reactFlowWrapper = ref)}>
      <span style={{ display: 'none' }}>{noteStore.forcer}</span>

      <Controls />

      {!pluginStore.loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          minZoom={0.1}
          nodeTypes={noteStore.nodeTypes}
          nodes={noteStore.elements as Array<CVFNode>}
          // edges={noteStore.elements as Array<OCVFEdge>}
          selectNodesOnDrag={false}
          onLoad={noteStore.onLoad}
          onNodeClick={noteStore.onElementClick}
          onConnect={noteStore.onConnect}
          onDrop={noteStore.onDrop}
          onDragOver={noteStore.onDragOver}
          onNodeContextMenu={noteStore.onDragOver}
          onNodeDragStop={noteStore.onNodeDragStop}
        >
          <MiniMap className="minimap" nodeStrokeColor={(_n) => '#333'} nodeColor={(_n) => '#DDD'} />
        </ReactFlow>
      )}
    </div>
  );
};

export default Flow;
