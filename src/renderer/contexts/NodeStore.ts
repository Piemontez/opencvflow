import { observable, action, computed, makeObservable } from 'mobx';
import { removeElements, addEdge, NodeTypesType } from 'react-flow-renderer';
import { createContext, RefObject } from 'react';
import { CVFEdgeData, OCVFEdge } from 'renderer/types/edge';
import { CVFNode } from 'renderer/types/node';
import { CVFComponent } from 'renderer/types/component';
import { v4 as uuidv4 } from 'uuid';
import { ComponentMenuAction } from 'renderer/types/menu';

const mockInitialElements: any /*Elements*/ = [
  {
    id: 'horizontal-1',
    sourcePosition: 'right',
    type: 'input',
    className: 'dark-node',
    data: { label: 'Input' },
    position: { x: 0, y: 80 },
  },
  {
    id: 'horizontal-2',
    sourcePosition: 'right',
    targetPosition: 'left',
    data: { label: 'A Node' },
    position: { x: 250, y: 0 },
  },
  {
    id: 'horizontal-e1-2',
    source: 'horizontal-1',
    type: 'smoothstep',
    target: 'horizontal-2',
    animated: true,
  },
];

type OCVFlowElement = CVFNode | OCVFEdge;
type OCVElements = Array<OCVFlowElement>;

class NodeStore {
  reactFlowInstance: any;
  reactFlowWrapper?: RefObject<HTMLDivElement>;

  constructor() {
    makeObservable(this);
    /*reaction(
      () => this.elements,
      (_) => console.log(this.elements.length)
    );*/
  }

  nodeTypes: NodeTypesType = {};
  nodeTypesByMenu: NodeTypesType = {};
  @observable elements: OCVElements = mockInitialElements;

  @action addNodeType = (component: typeof CVFComponent) => {
    this.nodeTypes[component.name] = component;
    if (component.menu?.title) {
      this.nodeTypesByMenu[component.menu?.title] = component;
    }
  };

  @action addNode = (node: CVFNode) => {
    this.elements.push(node);
  };

  @action removeNode = (node: CVFNode) => {
    const idx = this.elements.indexOf(node);
    if (idx > -1) {
      this.elements.splice(idx, 1);
      if (node.data?.edges) {
        for (const edge of node.data.edges) {
          this.removeEdge(edge);
        }
      }
    }
  };

  /*
  @action addEdge = (lnode: OCVFNode, rnode: OCVFNode) => {
    //this.elements.push(todo)
  };*/

  @action removeEdge = (edge: OCVFEdge | CVFEdgeData) => {
    let idx = -1;
    if ((edge as OCVFEdge).data) {
      //OCVFEdge
      idx = this.elements.indexOf(edge as OCVFEdge);
    } else {
      //CVFEdgeData
      idx = this.elements.findIndex((_) => _.data === edge);
    }
    if (idx > -1) {
      this.elements.splice(idx, 1);
    }
  };
  /**
   * Eventos disparados pelo ReactFlow
   * @param instance
   */

  onLoad = (instance: any) => {
    this.reactFlowInstance = instance;
    this.reactFlowInstance.fitView();
  };

  //Evento disparado pelo painel ao remover um elemento
  onElementsRemove = (elementsToRemove: any[]) =>
    removeElements(elementsToRemove, this.elements);
  //Evento disparado pelo painel ao conectar 2 nós
  onConnect = (params: any) => addEdge(params, this.elements);
  onDrop = (event: any) => {
    event.preventDefault();

    //console.log(this.reactFlowWrapper);
    //const reactFlowBounds = this.reactFlowWrapper!.current!.getBoundingClientRect();
    const action = event.dataTransfer.getData('application/action');

    const component = this.nodeTypesByMenu[action] as typeof CVFComponent;
    const position = this.reactFlowInstance.project({
      x: event.clientX,
      y: event.clientY,
    });

    const newNode: CVFNode = {
      id: uuidv4(),
      type: component.name,
      position: { x: Math.floor(position.y), y: Math.floor(position.y) },
      data: new component.processor(),
    };

    this.elements = this.elements.concat(newNode);
  };

  onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  //Evento disparado ao arrastar o componente do menu
  onDragStart = (event: any, menuAction: ComponentMenuAction) => {
    event.dataTransfer.setData('application/action', menuAction.title);
    event.dataTransfer.effectAllowed = 'move';
  };

  @computed get nodes() {
    return this.elements.filter(() => false);
  }

  @computed get edges() {
    return this.elements.filter(() => false);
  }
}

const instance = new NodeStore();

export default instance;
export const NodeStoreContext = createContext(instance);
