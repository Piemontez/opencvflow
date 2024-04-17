import ReactFlow, { MiniMap } from 'reactflow';
import Controls from './controls';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../contexts/PluginStore';
import { useNodeStore } from '../../contexts/NodeStore';

const Flow = () => {
  const noteStore = useNodeStore(useShallow((state) => state));
  const loaded = usePluginStore(useShallow((state) => state.loaded));

  return (
    <div className="reactflow-wrapper flex-fill" ref={(ref) => (noteStore.reactFlowWrapper = ref)}>
      <span style={{ display: 'none' }}>{noteStore.forcer}</span>

      <Controls />

      {!loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          minZoom={0.1}
          nodeTypes={noteStore.nodeTypes}
          nodes={noteStore.nodes}
          edges={noteStore.edges}
          selectNodesOnDrag={false}
          onInit={noteStore.onInit}
          onNodeClick={noteStore.onNodeClick}
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
