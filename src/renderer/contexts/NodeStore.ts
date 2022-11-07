import { observable, action, computed, makeObservable } from 'mobx';
import jsonToNodeStore from '../commons/jsonToNodeStore';
import {
  removeElements,
  NodeTypesType,
  XYPosition,
  Elements,
  Connection,
} from 'react-flow-renderer/nocss';
import { createContext, MouseEvent } from 'react';
import { CVFEdgeData, OCVFEdge } from 'renderer/types/edge';
import { CVFNode } from 'renderer/types/node';
import { CVFComponent } from 'renderer/types/component';
import { v4 as uuidv4 } from 'uuid';
import {
  ComponentMenuAction,
  MenuWithElementTitleProps,
} from 'renderer/types/menu';
import { notify } from 'renderer/components/Notification';
import GCStore from './GCStore';
import Storage from 'renderer/commons/Storage';
import nodeStoreToJson from 'renderer/commons/nodeStoreToJson';
import { OCVElements, OCVFlowElement } from 'renderer/types/ocv-elements';

interface NodeStoreI {
  running: boolean;
  elements: OCVElements;
  nodeTypes: NodeTypesType;
  currentElement?: OCVFlowElement;

  init(): void;
  fitView(): void;

  getNodeType(name: string): typeof CVFComponent | null;
  addNodeType(component: typeof CVFComponent): void;
  addNodeFromComponent(
    component: typeof CVFComponent,
    position: XYPosition,
    props?: Record<string, any>
  ): CVFNode;
  removeNode(nodeOrId: CVFNode | string): void;
  addEdge(
    source: CVFNode | string,
    target: CVFNode | string,
    sourceHandle: string | null,
    targetHandle: string | null
  ): void;
  removeEdge(edge: OCVFEdge | CVFEdgeData): void;

  run(): Promise<void>;
  stop(): Promise<void>;

  // Utilizado pelo componente React Flow
  reactFlowWrapper: HTMLDivElement | null;

  onLoad(instance: any): void;
  onElementClick(event: MouseEvent, element: any): void;
  refreshCurrentElement(): void;
  onElementsRemove(elements: Elements): void;
  onConnect(connection: any): void;
  onDrop(event: any): void;
  onDragOver(event: any): void;
  onDragStart(event: any, menuAction: ComponentMenuAction): void;
  onNodeDragStop(event: any, node: any): void;
  onNodeContextMenu(event: any, node: any): void;
}

class NodeStore implements NodeStoreI {
  @observable running: boolean = false;
  @observable elements: OCVElements = [];
  @observable currentElement?: OCVFlowElement;
  nodeTypes: NodeTypesType = {};
  nodeTypesByMenu: NodeTypesType = {};
  reactFlowInstance: any;
  reactFlowWrapper: HTMLDivElement | null = null;
  runner: Promise<true> | null = null;

  constructor() {
    makeObservable(this);
    /* reaction(
      () => this.elements,
      (_) => console.log(this.elements.length)
    ); */
  }

  init() {
    setTimeout(() => {
      try {
        const json = Storage.get('NodeStore', 'this');
        jsonToNodeStore(json);

        setTimeout(this.fitView, 100);
      } catch (err: any) {
        console.error(err);
        notify.danger(err.message);
      }
    }, 500);
  }

  storage() {
    const json = nodeStoreToJson();
    Storage.set('NodeStore', 'this', json);
    //console.log(json);
  }

  getNodeType = (name: string): typeof CVFComponent | null => {
    return this.nodeTypes[name] as typeof CVFComponent;
  };

  @action addNodeType = (component: typeof CVFComponent) => {
    this.nodeTypes[component.name] = component;
    if (component.menu?.title) {
      const key =
        (component.menu as MenuWithElementTitleProps).name ||
        (component.menu.title as string);
      this.nodeTypesByMenu[key] = component;
    }
  };

  @action addNodeFromComponent = (
    component: typeof CVFComponent,
    position: XYPosition,
    props?: Record<string, any>
  ): CVFNode => {
    const processor = new component.processor();
    const newNode: CVFNode = {
      id: uuidv4(),
      type: component.name,
      position,
      data: processor,
    };

    if (props) {
      Object.assign(processor, props);
    }

    this.elements = this.elements.concat(newNode);
    this.storage();

    return newNode;
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
          if (edge) {
            this.removeEdge(edge);
          }
        }
      }
      this.elements = [...this.elements];
      this.storage();
    }
  };

  @action addEdge = (
    sourceOrId: CVFNode | string,
    targetOrId: CVFNode | string,
    sourceHandle: string | null = null,
    targetHandle: string | null = null
  ) => {
    /* origem */
    const source =
      typeof sourceOrId === 'string'
        ? (this.elements.find((_) => _.id === sourceOrId) as CVFNode)
        : sourceOrId;
    /* destino */
    const target =
      typeof targetOrId === 'string'
        ? (this.elements.find((_) => _.id === targetOrId) as CVFNode)
        : targetOrId;

    if (!source) {
      notify.warn(`Source ${sourceOrId} not found.`);
      return;
    }
    if (!target) {
      notify.warn(`Target ${targetOrId} not found.`);
      return;
    }

    // Procura a posição da aresta a partir do nome da conexão/cabo
    const sourceCompoType = this.getNodeType(source.type!);
    const targetCompoType = this.getNodeType(target.type!);
    const sourceCompo: CVFComponent = new (sourceCompoType as any)();
    const targetCompo: CVFComponent = new (targetCompoType as any)();
    const sourcesIdx = sourceCompo.sources.findIndex(
      (s) => s.title === sourceHandle
    );
    const targetsIdx = targetCompo.targets.findIndex(
      (s) => s.title === targetHandle
    );

    // Aresta/Conexão
    const dataEdge = new CVFEdgeData(
      source.data,
      target.data,
      sourcesIdx,
      targetsIdx
    );
    const newEdge: OCVFEdge = {
      id: uuidv4(),
      source: source.id,
      target: target.id,
      sourceHandle,
      targetHandle,
      data: dataEdge,
    };

    // Adicionando a aresta aos nós
    source.data.outEdges[sourcesIdx] = dataEdge;
    target.data.inEdges[targetsIdx] = dataEdge;
    // Adicionar a aresta nos elementos da tela
    this.elements = this.elements.concat(newEdge);
    this.storage();
  };

  @action removeEdge = (edge: OCVFEdge | CVFEdgeData) => {
    let idx = -1;
    if ((edge as OCVFEdge).data) {
      // OCVFEdge
      idx = this.elements.indexOf(edge as OCVFEdge);
    } else {
      // CVFEdgeData
      idx = this.elements.findIndex((_) => _.data === edge);
    }
    if (idx > -1) {
      this.elements.splice(idx, 1);
      this.storage();
    }
  };

  @action run = async () => {
    if (this.running) {
      notify.info('The flow is already running.');
      return;
    }
    const { nodes } = this;
    if (!nodes.length) {
      notify.info('No flow defined.');
      return;
    }

    this.running = true;

    this.runner = new Promise(async (resolve) => {
      for (const node of nodes) {
        try {
          await node.data.start();
        } catch (err: any) {
          node.data.errorMessage =
            typeof err === 'number'
              ? `Code error: ${err}`
              : err?.message || 'Not detected';

          notify.danger(`Node ${node.id}: ${node.data.errorMessage}`);
        }
        if (!this.running) break;
      }

      let cycle = 0;
      while (this.running) {
        for (const node of nodes) {
          try {
            await node.data.proccess();
            if (node.data.errorMessage) {
              delete node.data.errorMessage;
            }
          } catch (err: any) {
            node.data.errorMessage =
              typeof err === 'number'
                ? `Code error: ${err}`
                : err?.message || 'Not detected';

            node.data.outputMsg(node.data.errorMessage!);
          }
          if (!this.running) break;
        }
        await new Promise((_res) => setTimeout(_res, 10));

        GCStore.replaceCycle(cycle++);
        GCStore.clear(cycle - 2);
      }

      GCStore.clear();

      resolve(true);
    });
  };

  @action stop = async () => {
    this.running = false;
    if (this.runner) {
      await this.runner;
      this.runner = null;

      for (const node of this.nodes) {
        try {
          if (node.data.stop) {
            await node.data.stop();
          }
        } catch (err: any) {
          console.error(err);
        }
      }
    }
  };

  fitView = () => {
    this.reactFlowInstance.fitView();
  };

  /**
   * Eventos disparados pelo ReactFlow
   * @param instance
   */

  onLoad = (instance: any) => {
    this.reactFlowInstance = instance;
  };

  @action onElementClick = (_: MouseEvent, element: OCVFlowElement) => {
    this.currentElement = element;
  };

  @action refreshCurrentElement = () => {
    this.currentElement = { ...this.currentElement } as OCVFlowElement;
  };

  // Evento disparado pelo painel ao remover um elemento
  onElementsRemove = (elements: Elements) =>
    removeElements(elements, this.elements);

  // Evento disparado pelo painel ao conectar 2 nós
  @action onConnect = ({
    source,
    target,
    sourceHandle,
    targetHandle,
  }: Connection) => {
    this.addEdge(source!, target!, sourceHandle, targetHandle);
  };

  @action onDrop = (event: any) => {
    event.preventDefault();

    if (this.running) {
      notify.warn('Application is running. Stop application first.');
      return;
    }

    const appAction = event.dataTransfer.getData('application/action');
    if (appAction) {
      const reactFlowBounds = this.reactFlowWrapper!.getBoundingClientRect();
      const component = this.nodeTypesByMenu[appAction] as typeof CVFComponent;
      const position = this.reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      this.addNodeFromComponent(component, position);
    }
  };

  onDragOver = (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  // Evento disparado ao arrastar o componente do menu
  onDragStart = (event: any, menuAction: ComponentMenuAction) => {
    event.dataTransfer.setData('application/action', menuAction.title);
    event.dataTransfer.effectAllowed = 'move';
  };

  onNodeDragStop = (event: any, node: any) => {
    event.preventDefault();
    const storeNode = this.elements.find((_) => _.id === node.id) as CVFNode;
    if (storeNode) {
      storeNode.position = node.position;
    }
    this.storage();
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
