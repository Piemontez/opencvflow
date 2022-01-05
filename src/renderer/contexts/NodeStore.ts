import { observable, action, computed, makeObservable } from 'mobx';
import { removeElements, NodeTypesType, XYPosition } from 'react-flow-renderer';
import { createContext, RefObject } from 'react';
import { CVFEdgeData, OCVFEdge } from 'renderer/types/edge';
import { CVFNode } from 'renderer/types/node';
import { CVFComponent } from 'renderer/types/component';
import { v4 as uuidv4 } from 'uuid';
import { ComponentMenuAction } from 'renderer/types/menu';

type OCVFlowElement = CVFNode | OCVFEdge;
type OCVElements = Array<OCVFlowElement>;

interface NodeStoreI {
  running: boolean;
  elements: OCVElements;
  nodeTypes: NodeTypesType;

  addNodeType(component: typeof CVFComponent): void;
  addNodeFromComponent(
    component: typeof CVFComponent,
    position: XYPosition
  ): void;
  removeNode(nodeOrId: CVFNode | string): void;
  addEdge(source: CVFNode, target: CVFNode): void;
  removeEdge(edge: OCVFEdge | CVFEdgeData): void;

  run(): Promise<void>;
  stop(): Promise<void>;

  //Utilizado pelo componente React Flow
  reactFlowWrapper?: RefObject<HTMLDivElement>;

  onLoad(instance: any): void;
  onElementsRemove(elementsToRemove: any[]): void;
  onConnect(params: any): void;
  onDrop(event: any): void;
  onDragOver(event: any): void;
  onDragStart(event: any, menuAction: ComponentMenuAction): void;
  onNodeContextMenu(event: any, node: any): void;
}

class NodeStore {
  @observable running: boolean = false;
  @observable elements: OCVElements = [];
  nodeTypes: NodeTypesType = {};
  nodeTypesByMenu: NodeTypesType = {};
  reactFlowInstance: any;
  reactFlowWrapper?: RefObject<HTMLDivElement>;

  constructor() {
    makeObservable(this);
    /*reaction(
      () => this.elements,
      (_) => console.log(this.elements.length)
    );*/
  }

  @action addNodeType = (component: typeof CVFComponent) => {
    this.nodeTypes[component.name] = component;
    if (component.menu?.title) {
      this.nodeTypesByMenu[component.menu?.title] = component;
    }
  };

  @action addNodeFromComponent = (
    component: typeof CVFComponent,
    position: XYPosition
  ) => {
    const processor = new component.processor();
    const newNode: CVFNode = {
      id: uuidv4(),
      type: component.name,
      position: { x: Math.floor(position.y), y: Math.floor(position.y) },
      data: processor,
    };

    this.elements = this.elements.concat(newNode);
  };

  @action removeNode = (nodeOrId: CVFNode | string) => {
    const idx =
      typeof nodeOrId === 'string'
        ? this.elements.findIndex((_) => _.id === nodeOrId)
        : this.elements.indexOf(nodeOrId);
    if (idx > -1) {
      const node = this.elements.splice(idx, 1)[0] as CVFNode;
      if (node.data?.edges) {
        for (const edge of node.data.edges) {
          this.removeEdge(edge);
        }
      }
      this.elements = [...this.elements];
    }
  };

  @action addEdge = (sourceOrId: CVFNode, targetOrId: CVFNode) => {
    const source =
      typeof sourceOrId === 'string'
        ? (this.elements.find((_) => _.id === sourceOrId) as CVFNode)
        : sourceOrId;
    const target =
      typeof targetOrId === 'string'
        ? (this.elements.find((_) => _.id === targetOrId) as CVFNode)
        : targetOrId;
    const dataEdge = new CVFEdgeData(source.data, target.data);
    const newEdge: OCVFEdge = {
      id: uuidv4(),
      source: source.id,
      target: target.id,
      data: dataEdge,
    };
    source.data.edges.push(dataEdge);
    target.data.edges.push(dataEdge);
    this.elements = this.elements.concat(newEdge);
  };

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

  @action run = async () => {
    if (this.running) return;
    this.running = true;

    const nodes = this.nodes;
    for (const node of nodes) {
      if (node.data.start) {
        await node.data.start();
      }
    }

    while (this.running)
      for (const node of nodes) {
        try {
          await node.data.proccess();
          if (node.data.errorMessage) {
            delete node.data.errorMessage;
          }
        } catch (err: any) {
          node.data.errorMessage = err.message;
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
  };

  @action stop = async () => {
    this.running = false;

    const nodes = this.nodes;
    for (const node of nodes) {
      if (node.data.stop) {
        await node.data.stop();
      }
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
  @action onConnect = ({ source, target }: any) => {
    this.addEdge(source, target);
  };
  onDrop = (event: any) => {
    event.preventDefault();

    //const reactFlowBounds = this.reactFlowWrapper!.current!.getBoundingClientRect();
    const action = event.dataTransfer.getData('application/action');
    const component = this.nodeTypesByMenu[action] as typeof CVFComponent;
    const position = this.reactFlowInstance.project({
      x: event.clientX,
      y: event.clientY,
    });
    this.addNodeFromComponent(component, position);
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

  onNodeContextMenu = (event: any, node: any) => {
    event.preventDefault();
    console.log('context menu:', node);
  };

  @computed get nodes(): Array<CVFNode> {
    return this.elements.filter(
      (el) => !(el as OCVFEdge).sourceHandle
    ) as Array<CVFNode>;
  }

  @computed get edges(): Array<OCVFEdge> {
    return this.elements.filter(
      (el) => (el as OCVFEdge).sourceHandle
    ) as Array<OCVFEdge>;
  }
}

const instance = new NodeStore() as NodeStoreI;

export default instance;
export const NodeStoreContext = createContext(instance);
