import ReactFlow, { Background, BackgroundVariant, MiniMap } from 'reactflow';
import { useShallow } from 'zustand/react/shallow';
import { usePluginStore } from '../../contexts/PluginStore';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useDarkModeStore } from '../../contexts/DarkModeStore';
import OCFControls from './controls';

const Flow = () => {
  const noteStore = useNodeStore(useShallow((state) => state));
  const loaded = usePluginStore(useShallow((state) => state.loaded));
  const mode = useDarkModeStore(useShallow((state) => state.mode));

  const flowBG = mode === 'dark' ? { background: 'var(--bs-gray-600)' } : undefined;
  const dotBG = mode === 'dark' ? 'white' : 'gray';

  return (
    <div className="reactflow-wrapper flex-fill" ref={(ref) => (noteStore.reactFlowWrapper = ref)}>
      <span style={{ display: 'none' }}>{noteStore.forcer}</span>

      {!loaded ? (
        <p>Loading Plugin</p>
      ) : (
        <ReactFlow
          minZoom={0.1}
          selectNodesOnDrag={false}
          nodeTypes={noteStore.nodeTypes}
          nodes={noteStore.nodes}
          edges={noteStore.edges}
          onInit={noteStore.onInit}
          snapToGrid={true}
          onNodeClick={noteStore.onNodeClick}
          onConnect={noteStore.onConnect}
          onDrop={noteStore.onDrop}
          onDragOver={noteStore.onDragOver}
          onNodeContextMenu={noteStore.onDragOver}
          onNodeDragStop={noteStore.onNodeDragStop}
          style={flowBG}
        >
          <OCFControls />
          <Background color={dotBG} variant={BackgroundVariant.Dots} />
          <MiniMap className="minimap" nodeStrokeColor={(_n) => '#333'} nodeColor={(_n) => '#DDD'} />
        </ReactFlow>
      )}
    </div>
  );
};

export default Flow;
