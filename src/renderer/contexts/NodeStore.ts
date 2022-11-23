import { observable, action, computed, makeObservable } from 'mobx';
import jsonToNodeStore from '../commons/jsonToNodeStore';
import {
  removeElements,
  NodeTypesType,
  XYPosition,
  Elements,
  Connection,
} from 'react-flow-renderer/nocss';
import React, { createContext, MouseEvent } from 'react';
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
import { CustomComponent } from 'renderer/types/custom-component';

interface NodeStoreI {
  running: boolean;
  forcer: number;
  elements: OCVElements;
  nodeTypes: NodeTypesType;
  currentElement?: OCVFlowElement;

  init(): void;
  storage(): void;
  fitView(): void;

  getNodeType(name: string): typeof CVFComponent | null;
  addNodeType(
    component: typeof CVFComponent,
    options?: { repaint: boolean }
  ): void;
  addNodeFromComponent(
    component: typeof CVFComponent,
    position: XYPosition,
    props?: Record<string, any>
  ): CVFNode;
  removeNodeType(name: string): void;

  removeNode(nodeOrId: CVFNode | string): void;
  refreshNodesFromComponent(component: typeof CVFComponent): void;

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
  onDragStartCustom(event: any, customComp: CustomComponent): void;
  onNodeDragStop(event: any, node: any): void;
  onNodeContextMenu(event: any, node: any): void;
}

class NodeStore implements NodeStoreI {
  @observable running: boolean = false;
  @observable forcer: number = 0;
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
  }

  @action refreshFlow(repaint: boolean = false) {
    if (repaint) {
      this.forcer++;
      setTimeout(() => this.forcer++, 100);
    } else {
      this.forcer += 2;
    }
  }

  getNodeType = (name: string): typeof CVFComponent | null => {
    return this.nodeTypes[name] as typeof CVFComponent;
  };

  @action addNodeType = (
    component: typeof CVFComponent,
    { repaint }: any = { repaint: true }
  ) => {
    this.nodeTypes[component.name] = component;
    if (component.menu?.title) {
      const key =
        (component.menu as MenuWithElementTitleProps).name ||
        (component.menu.title as string);
      this.nodeTypesByMenu[key] = component;
    }

    this.refreshFlow(repaint);
  };

  @action removeNodeType = (name: string) => {
    delete this.nodeTypes[name];

    const elementIds = this.elements
      .filter((el) => el.type === name)
      .map((el) => el.id);

    for (const elementId of elementIds) {
      this.removeNode(elementId);
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
      data: { processor },
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
      if (node.data?.processor?.edges) {
        for (const edge of node.data.processor.edges) {
          if (edge) {
            this.removeEdge(edge);
          }
        }
      }
      this.elements = [...this.elements];
      this.storage();
    }
  };

  @action refreshNodesFromComponent = (component: typeof CVFComponent) => {
    let refresh = false;
    for (const node of this.nodes) {
      //Verifica se o componente esta sendo utilizado em tela.
      if (node.type === component.name) {
        refresh = true;
        // Copia as propriedades do antigo nó processador para o novo.
        const newProcessor = new component.processor();
        newProcessor.id = 2;
        for (const key of Object.keys(node.data.processor)) {
          if (
            node.data.processor.hasOwnProperty(key) &&
            'function' !== typeof (node.data as any)[key]
          ) {
            (newProcessor as any)[key] = (node.data.processor as any)[key];
          }
        }

        // Se rodando os processamento
        if (this.running && node.data.processor) {
          //Roda a função de parada do processador a ser subistituido
          node.data.processor.stop();
        }

        //Troca o antigo processador pelo novo
        node.data.processor = newProcessor;
        const comp = node.data.processor.componentPointer
          .current as React.Component as any;
        comp.initOutputs();
      }
    }

    if (refresh) {
      this.elements = [...this.elements];
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
      source.data.processor,
      target.data.processor,
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
    source.data.processor.outEdges[sourcesIdx] = dataEdge;
    target.data.processor.inEdges[targetsIdx] = dataEdge;
    // Adicionar a aresta nos elementos da tela
    this.elements = this.elements.concat(newEdge);
    this.storage();
  };

  @action removeEdge = (edge: OCVFEdge | CVFEdgeData) => {
    let data = (edge as OCVFEdge).data;

    let idx = -1;
    if (data) {
      // OCVFEdge
      idx = this.elements.indexOf(edge as OCVFEdge);
    } else {
      // CVFEdgeData
      idx = this.elements.findIndex((_) => _.data === edge);
      data = edge as CVFEdgeData;
    }
    if (idx > -1) {
      this.elements.splice(idx, 1);
      this.storage();
    }

    // Remove o edge dos nós
    if (data) {
      if (data.sourceIdx > -1) {
        data.sourceProcessor.outEdges.splice(data.sourceIdx, 1);
      }
      if (data.targetIdx > -1) {
        data.targetProcessor.inEdges.splice(data.targetIdx, 1);
      }
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
          node.data.processor.componentPointer.current.initOutputs();

          await node.data.processor.start();
        } catch (err: any) {
          node.data.processor.errorMessage =
            typeof err === 'number'
              ? `Code error: ${err}`
              : err?.message || 'Not detected';

          notify.danger(`Node ${node.id}: ${node.data.processor.errorMessage}`);
        }
        if (!this.running) break;
      }

      let cycle = 0;
      while (this.running) {
        for (const node of nodes) {
          try {
            await node.data.processor.proccess();
            if (node.data.processor.errorMessage) {
              delete node.data.processor.errorMessage;
            }
          } catch (err: any) {
            node.data.processor.errorMessage =
              typeof err === 'number'
                ? `Code error: ${err}`
                : err?.message || 'Not detected';

            node.data.processor.outputMsg(node.data.processor.errorMessage!);
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
          if (node.data.processor.stop) {
            await node.data.processor.stop();
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

    let component = null;

    const appAction = event.dataTransfer.getData('application/menuaction');
    if (appAction) {
      component = this.nodeTypesByMenu[appAction] as typeof CVFComponent;
    }
    const customComponent = event.dataTransfer.getData(
      'application/customcomponent'
    );
    if (customComponent) {
      component = this.nodeTypes[customComponent] as typeof CVFComponent;
    }

    if (component) {
      const reactFlowBounds = this.reactFlowWrapper!.getBoundingClientRect();
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
    event.dataTransfer.setData('application/menuaction', menuAction.title);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Evento disparado ao arrastar um custom componente do menu
  onDragStartCustom = (event: any, customComp: CustomComponent) => {
    event.dataTransfer.setData('application/customcomponent', customComp.name);
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
