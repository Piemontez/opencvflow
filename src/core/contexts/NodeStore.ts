import { NodeTypes, XYPosition, Connection } from 'reactflow';
import React, { MouseEvent } from 'react';
import { CVFEdgeData, OCVFEdge } from '../types/edge';
import { CVFNode } from '../types/node';
import { CVFComponent } from '../../ide/types/component';
import { v5 as uuidv5 } from 'uuid';
import { ComponentMenuAction, MenuWithElementTitleProps } from '../../ide/types/menu';
import Storage from '../../ide/commons/Storage';
import nodeStoreToJson from '../utils/nodeStoreToJson';
import { CustomNodeType } from '../types/custom-node-type';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { create } from 'zustand';
import { STORAGE_NODESTORE_ID } from '../../ide/commons/consts';
import { useRunnerStore } from './RunnerStore';

const uuidv5Hash = 'c54ab9bc-e083-56f2-9d1e-3eec4bcc93ad';

export type NodeState = {
  forcer: number;
  nodes: Array<CVFNode>;
  edges: Array<OCVFEdge>;
  currentElement?: CVFNode;
  nodeTypes: NodeTypes;
  nodeTypesByMenu: NodeTypes;
  reactFlowInstance: any;
  reactFlowWrapper: HTMLDivElement | null;

  clear: () => void;
  storage: () => void;
  refreshFlow: (refreshNodes?: boolean) => void;
  // Node Type
  getMenuActionId: (menuAction: ComponentMenuAction) => string;
  hasNodeType: (name: string) => boolean;
  getNodeType: (name: string) => typeof CVFComponent | null;
  addNodeType: (component: typeof CVFComponent) => void;
  removeNodeType: (name: string) => void;
  // Node
  addNodeFromComponent: (component: typeof CVFComponent, position: XYPosition, props?: Record<string, any>) => CVFNode;
  removeNode: (nodeOrId: CVFNode | string) => void;
  refreshNodes: (nodes?: Array<CVFNode>) => void;
  refreshNodesFromComponent: (component: typeof CVFComponent) => void;
  // Edge
  addEdge: (sourceOrId: CVFNode | string, targetOrId: CVFNode | string, sourceHandle: string | null, targetHandle: string | null) => void;
  removeEdge: (edge: OCVFEdge | CVFEdgeData) => void;
  // React Flow Events
  fitView: () => void;
  onInit: (instance: any) => void;
  onNodeClick: (_: MouseEvent, node: CVFNode) => void;
  refreshCurrentElement: () => void;
  onConnect: ({ source, target, sourceHandle, targetHandle }: Connection) => void;
  onDrop: (event: any) => void;
  onDragOver: (event: any) => void;
  onDragStart: (event: any, menuAction: ComponentMenuAction) => void;
  onDragStartCustom: (event: any, customComp: CustomNodeType) => void;
  onNodeDragStop: (event: any, node: any) => void;
  onNodeContextMenu: (event: any, node: any) => void;
};

export const useNodeStore = create<NodeState>((set, get) => ({
  forcer: 0,
  nodes: [] as Array<CVFNode>,
  edges: [] as Array<OCVFEdge>,
  currentElement: undefined as undefined | CVFNode,
  nodeTypes: {} as NodeTypes,
  nodeTypesByMenu: {} as NodeTypes,
  reactFlowInstance: null as any,
  reactFlowWrapper: null as HTMLDivElement | null,

  clear: () => {
    set({ nodes: [], edges: [] });
  },

  storage: () => {
    const json = nodeStoreToJson(get());
    Storage.set(STORAGE_NODESTORE_ID, 'this', json);
  },

  refreshFlow: (refreshNodes: boolean = false) => {
    if (refreshNodes) {
      set({ nodes: [...get().nodes] });
    } else {
      set({ forcer: get().forcer + 1 });
    }
  },

  getMenuActionId: (menuAction: ComponentMenuAction) => {
    return menuAction.name || '' + menuAction.title;
  },

  hasNodeType: (name: string): boolean => {
    return get().nodeTypes.hasOwnProperty(name);
  },

  getNodeType: (name: string): typeof CVFComponent | null => {
    return get().nodeTypes[name] as any as typeof CVFComponent;
  },

  addNodeType: (component: typeof CVFComponent) => {
    const { nodeTypes, nodeTypesByMenu } = get();
    nodeTypes[component.name] = component as any;

    if (component.menu) {
      const actionId = get().getMenuActionId(component.menu!);
      nodeTypesByMenu[actionId] = component as any;
    }

    set({ nodeTypes: { ...nodeTypes }, nodeTypesByMenu });
  },

  removeNodeType: (name: string) => {
    delete get().nodeTypes[name];

    const nodesIds = get()
      .nodes.filter((el) => el.type === name)
      .map((el) => el.id);

    for (const nodeId of nodesIds) {
      get().removeNode(nodeId);
    }
  },

  addNodeFromComponent: (component: typeof CVFComponent, position: XYPosition, props?: Record<string, any>): CVFNode => {
    const processor = new component.processor();
    const uuid = uuidv5(component.name + position.x + position.y + Math.random().toString(36).substring(2), uuidv5Hash);
    const newNode: CVFNode = {
      id: uuid,
      type: component.name,
      position,
      data: { processor },
    };

    if (props) {
      Object.assign(processor, props);
    }

    set({
      nodes: [
        //
        ...get().nodes,
        newNode,
      ],
    });
    get().storage();
    return newNode;
  },

  removeNode: (nodeOrId: CVFNode | string) => {
    const nodes = get().nodes;
    const idx = typeof nodeOrId === 'string' ? nodes.findIndex((_) => _.id === nodeOrId) : nodes.indexOf(nodeOrId);
    if (idx > -1) {
      const node = nodes.splice(idx, 1)[0] as CVFNode;
      if (node.data?.processor?.edges) {
        for (const edge of node.data.processor.edges) {
          if (edge) {
            get().removeEdge(edge);
          }
        }
      }

      set({
        nodes: [...nodes],
      });
      get().storage();
    }
  },

  refreshNodes: (nodes?: Array<CVFNode>) => {
    set({ nodes: nodes ?? get().nodes });
  },

  refreshNodesFromComponent: (component: typeof CVFComponent) => {
    let refresh = false;
    for (const node of get().nodes) {
      //Verifica se o componente esta sendo utilizado em tela.
      if (node.type === component.name) {
        refresh = true;
        // Copia as propriedades do antigo nó processador para o novo.
        const newProcessor = new component.processor();
        for (const key of Object.keys(node.data.processor)) {
          if (node.data.processor.hasOwnProperty(key) && 'function' !== typeof (node.data as any)[key]) {
            (newProcessor as any)[key] = (node.data.processor as any)[key];
          }
        }

        // Se rodando os processamento
        if (useRunnerStore.getState().running && node.data.processor) {
          //Roda a função de parada do processador a ser subistituido
          node.data.processor.stop();
        }

        //Troca o antigo processador pelo novo
        node.data.processor = newProcessor;
        const comp = node.data.processor.componentPointer.current as React.Component as any;
        comp.initOutputs();
      }
    }

    if (refresh) {
      set({ nodes: [...get().nodes] });
    }
  },

  addEdge: (sourceOrId: CVFNode | string, targetOrId: CVFNode | string, sourceHandle: string | null = null, targetHandle: string | null = null) => {
    /* origem */
    const source = typeof sourceOrId === 'string' ? (get().nodes.find((_) => _.id === sourceOrId) as CVFNode) : sourceOrId;
    /* destino */
    const target = typeof targetOrId === 'string' ? (get().nodes.find((_) => _.id === targetOrId) as CVFNode) : targetOrId;

    if (!source) {
      useNotificationStore.getState().warn(`Source ${sourceOrId} not found.`);
      return;
    }
    if (!target) {
      useNotificationStore.getState().warn(`Target ${targetOrId} not found.`);
      return;
    }

    // Procura a posição da aresta a partir do nome da conexão/cabo
    const sourceCompoType = get().getNodeType(source.type!);
    const targetCompoType = get().getNodeType(target.type!);
    const sourceCompo: CVFComponent = new (sourceCompoType as any)();
    const targetCompo: CVFComponent = new (targetCompoType as any)();
    const sourcesIdx = sourceCompo.sources.findIndex((s) => s.title === sourceHandle);
    const targetsIdx = targetCompo.targets.findIndex((s) => s.title === targetHandle);

    const uuid = uuidv5(source.id + target.id + sourceHandle + targetHandle, uuidv5Hash);
    // Verifica se a conexão já existe
    const hasOnde = get().edges.find((_) => _.id === uuid);
    if (hasOnde) {
      return;
    }

    // Aresta/Conexão
    const dataEdge = new CVFEdgeData(source.data.processor, target.data.processor, sourcesIdx, targetsIdx);
    const newEdge: OCVFEdge = {
      id: uuid,
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
    set({
      edges: [...get().edges, newEdge],
    });

    get().storage();
  },

  removeEdge: (edge: OCVFEdge | CVFEdgeData) => {
    const edges = get().edges;
    let data = (edge as OCVFEdge).data;

    let idx = -1;
    if (data) {
      // OCVFEdge
      idx = edges.indexOf(edge as OCVFEdge);
    } else {
      // CVFEdgeData
      idx = edges.findIndex((_) => _.data === edge);
      data = edge as CVFEdgeData;
    }
    if (idx > -1) {
      edges.splice(idx, 1);
      set({ edges });

      get().storage();
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
  },

  fitView: () => {
    get().reactFlowInstance.fitView();
  },

  /**
   * Eventos disparados pelo ReactFlow
   * @param instance
   */

  onInit: (instance: any) => {
    get().reactFlowInstance = instance;
  },

  onNodeClick: (_: MouseEvent, node: CVFNode) => {
    set({ currentElement: node });
  },

  refreshCurrentElement: () => {
    set({ currentElement: { ...get().currentElement } as CVFNode });
  },

  // Evento disparado pelo painel ao remover um elemento
  //onElementsRemove = (elements: Elements) => removeElements(elements, get().elements);

  // Evento disparado pelo painel ao conectar 2 nós
  onConnect: ({ source, target, sourceHandle, targetHandle }: Connection) => {
    get().addEdge(source!, target!, sourceHandle, targetHandle);
  },

  onDrop: (event: any) => {
    event.preventDefault();

    if (useRunnerStore.getState().running) {
      useNotificationStore.getState().warn('Application is running. Stop application first.');
      return;
    }

    let component = null;

    const appAction = event.dataTransfer.getData('application/menuaction');
    if (appAction) {
      component = get().nodeTypesByMenu[appAction] as any as typeof CVFComponent;
    }

    const customComponent = event.dataTransfer.getData('application/customcomponent');
    if (customComponent) {
      component = get().nodeTypes[customComponent] as any as typeof CVFComponent;
    }

    if (component) {
      const reactFlowBounds = get().reactFlowWrapper!.getBoundingClientRect();
      const position = get().reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      get().addNodeFromComponent(component, position);
    }
  },

  onDragOver: (event: any) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  },

  // Evento disparado ao arrastar o componente do menu
  onDragStart: (event: any, menuAction: ComponentMenuAction) => {
    const actionId = get().getMenuActionId(menuAction);
    event.dataTransfer.setData('application/menuaction', actionId);
    event.dataTransfer.effectAllowed = 'move';
  },

  // Evento disparado ao arrastar um custom componente do menu
  onDragStartCustom: (event: any, customComp: CustomNodeType) => {
    event.dataTransfer.setData('application/customcomponent', customComp.name);
    event.dataTransfer.effectAllowed = 'move';
  },

  onNodeDragStop: (event: any, node: any) => {
    event.preventDefault();
    const storeNode = get().nodes.find((_) => _.id === node.id) as CVFNode;
    if (storeNode) {
      storeNode.position = node.position;
    }

    get().refreshFlow(true);
    get().storage();
  },

  onNodeContextMenu: (event: any, _: any) => {
    event.preventDefault();
  },
}));
