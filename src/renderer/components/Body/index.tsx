import { observer } from 'mobx-react';
import { useContext } from 'react';

import ReactFlow from 'react-flow-renderer';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { CVVideoCaptureComponent } from 'plugins/opencv/videoio';

const onNodeMouseEnter = (_event: any, node: any) =>
  console.log('mouse enter:', node);
const onNodeMouseMove = (_event: any, node: any) =>
  console.log('mouse move:', node);
const onNodeMouseLeave = (_event: any, node: any) =>
  console.log('mouse leave:', node);
const onNodeContextMenu = (event: any, node: any) => {
  event.preventDefault();
  console.log('context menu:', node);
};

const Body = () => {
  const noteStore = useContext(NodeStoreContext);

  return (
    <div
      className="reactflow-wrapper flex-fill"
      ref={noteStore.reactFlowWrapper}
    >
      <ReactFlow
        nodeTypes={{ CVVideoCaptureComponent: CVVideoCaptureComponent }}
        elements={noteStore.elements}
        onLoad={noteStore.onLoad}
        onElementsRemove={noteStore.onElementsRemove}
        onConnect={noteStore.onConnect}
        selectNodesOnDrag={false}
        onDrop={noteStore.onDrop}
        onDragOver={noteStore.onDragOver}
        onNodeMouseEnter={onNodeMouseEnter}
        onNodeMouseMove={onNodeMouseMove}
        onNodeMouseLeave={onNodeMouseLeave}
        onNodeContextMenu={onNodeContextMenu}
      />
    </div>
  );
};

export default observer(Body);
