import { observer } from 'mobx-react';
import { useContext } from 'react';

import ReactFlow from 'react-flow-renderer';
import NodeStore from 'renderer/contexts/NodeStore';

const onLoad = (reactFlowInstance: any) => reactFlowInstance.fitView();

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
  const noteStore = useContext(NodeStore);

  return (
    <ReactFlow
      className="flex-fill"
      elements={noteStore.elements}
      onElementsRemove={noteStore.onElementsRemove}
      onConnect={noteStore.onConnect}
      onLoad={onLoad}
      selectNodesOnDrag={false}
      onNodeMouseEnter={onNodeMouseEnter}
      onNodeMouseMove={onNodeMouseMove}
      onNodeMouseLeave={onNodeMouseLeave}
      onNodeContextMenu={onNodeContextMenu}
    />
  );
};

export default observer(Body);