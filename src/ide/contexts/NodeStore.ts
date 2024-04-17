import jsonToNodeStore from '../commons/jsonToNodeStore';
import {
  //removeElements,
  NodeTypes,
  XYPosition,
  //Elements,
  Connection,
} from 'reactflow';
import React, { MouseEvent } from 'react';
import { CVFEdgeData, OCVFEdge } from '../types/edge';
import { CVFNode } from '../types/node';
import { CVFComponent } from '../types/component';
import { v4 as uuidv4 } from 'uuid';
import { ComponentMenuAction, MenuWithElementTitleProps } from '../types/menu';
import GCStore from './GCStore';
import Storage from '../commons/Storage';
import nodeStoreToJson from '../commons/nodeStoreToJson';
import { OCVElements, OCVFlowElement } from '../types/ocv-elements';
import { CustomComponent } from '../types/custom-component';
import { useNotificationStore } from '../components/Notification/store';
import { create } from 'zustand';

export const useNodeStore = create((set: any, get: any) => ({
  running: false,
  forcer: 0,
  elements: [] as OCVElements,
  currentElement: undefined as undefined | OCVFlowElement,
  nodeTypes: {} as NodeTypes,
  nodeTypesByMenu: {} as NodeTypes,
  reactFlowInstance: null as any,
  reactFlowWrapper: null as HTMLDivElement | null,
  runner: null as Promise<true> | null,

  init: () => {
    setTimeout(() => {
      try {
        const json = Storage.get('NodeStore', 'this');
        jsonToNodeStore(json);

        setTimeout(get().fitView, 100);
      } catch (err: any) {
        console.error(err);
        useNotificationStore.getState().danger(err.message);
      }
    }, 500);
  },

  clear: () => {
    set({ elements: [] });
  },

  storage: () => {
    const json = nodeStoreToJson();
    Storage.set('NodeStore', 'this', json);
  },

  refreshFlow: (repaint: boolean = false) => {
    if (repaint) {
      get().forcer++;
      setTimeout(() => get().forcer++, 100);
    } else {
      get().forcer += 2;
    }
  },

  getNodeType: (name: string): typeof CVFComponent | null => {
    return get().nodeTypes[name] as typeof CVFComponent;
  },

  addNodeType: (component: typeof CVFComponent, { repaint }: any = { repaint: true }) => {
    get().nodeTypes[component.name] = component;
    if (component.menu?.title) {
      const key = (component.menu as MenuWithElementTitleProps).name || (component.menu.title as string);
      get().nodeTypesByMenu[key] = component;
    }

    get().refreshFlow(repaint);
  },

  removeNodeType: (name: string) => {
    delete get().nodeTypes[name];

    const elementIds = get()
      .elements.filter((el) => el.type === name)
      .map((el) => el.id);

    for (const elementId of elementIds) {
      get().removeNode(elementId);
    }
  },

  addNodeFromComponent: (component: typeof CVFComponent, position: XYPosition, props?: Record<string, any>): CVFNode => {
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

    get().elements = get().elements.concat(newNode);
    get().storage();

    return newNode;
  },

  removeNode: (nodeOrId: CVFNode | string) => {
    const idx = typeof nodeOrId === 'string' ? get().elements.findIndex((_) => _.id === nodeOrId) : get().elements.indexOf(nodeOrId);
    if (idx > -1) {
      const node = get().elements.splice(idx, 1)[0] as CVFNode;
      if (node.data?.processor?.edges) {
        for (const edge of node.data.processor.edges) {
          if (edge) {
            get().removeEdge(edge);
          }
        }
      }
      get().elements = [...get().elements];
      get().storage();
    }
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
        if (get().running && node.data.processor) {
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
      get().elements = [...get().elements];
    }
  },

  addEdge: (sourceOrId: CVFNode | string, targetOrId: CVFNode | string, sourceHandle: string | null = null, targetHandle: string | null = null) => {
    /* origem */
    const source = typeof sourceOrId === 'string' ? (get().elements.find((_) => _.id === sourceOrId) as CVFNode) : sourceOrId;
    /* destino */
    const target = typeof targetOrId === 'string' ? (get().elements.find((_) => _.id === targetOrId) as CVFNode) : targetOrId;

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

    // Aresta/Conexão
    const dataEdge = new CVFEdgeData(source.data.processor, target.data.processor, sourcesIdx, targetsIdx);
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
    get().elements = get().elements.concat(newEdge);
    get().storage();
  },

  removeEdge: (edge: OCVFEdge | CVFEdgeData) => {
    let data = (edge as OCVFEdge).data;

    let idx = -1;
    if (data) {
      // OCVFEdge
      idx = get().elements.indexOf(edge as OCVFEdge);
    } else {
      // CVFEdgeData
      idx = get().elements.findIndex((_) => _.data === edge);
      data = edge as CVFEdgeData;
    }
    if (idx > -1) {
      get().elements.splice(idx, 1);
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

  run: async () => {
    if (get().running) {
      useNotificationStore.getState().info('The flow is already running.');
      return;
    }
    const { nodes } = this;
    if (!nodes.length) {
      useNotificationStore.getState().info('No flow defined.');
      return;
    }

    get().running = true;

    get().runner = new Promise(async (resolve) => {
      for (const node of nodes) {
        try {
          node.data.processor.componentPointer.current.initOutputs();

          await node.data.processor.start();
        } catch (err: any) {
          node.data.processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

          useNotificationStore.getState().danger(`Node ${node.id}: ${node.data.processor.errorMessage}`);
        }
        if (!get().running) break;
      }

      let cycle = 0;
      while (get().running) {
        for (const node of nodes) {
          try {
            await node.data.processor.proccess();
            if (node.data.processor.errorMessage) {
              delete node.data.processor.errorMessage;
            }
          } catch (err: any) {
            node.data.processor.errorMessage = typeof err === 'number' ? `Code error: ${err}` : err?.message || 'Not detected';

            node.data.processor.outputMsg(node.data.processor.errorMessage!);
          }
          if (!get().running) break;
        }
        await new Promise((_res) => setTimeout(_res, 10));

        GCStore.replaceCycle(cycle++);
        GCStore.clear(cycle - 2);
      }

      GCStore.clear();

      resolve(true);
    });
  },

  stop: async () => {
    get().running = false;
    if (get().runner) {
      await get().runner;
      get().runner = null;

      for (const node of get().nodes) {
        try {
          if (node.data.processor.stop) {
            await node.data.processor.stop();
          }
        } catch (err: any) {
          console.error(err);
        }
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

  onLoad: (instance: any) => {
    get().reactFlowInstance = instance;
  },

  onElementClick: (_: MouseEvent, element: OCVFlowElement) => {
    get().currentElement = element;
  },

  refreshCurrentElement: () => {
    get().currentElement = { ...get().currentElement } as OCVFlowElement;
  },

  // Evento disparado pelo painel ao remover um elemento
  //onElementsRemove = (elements: Elements) => removeElements(elements, get().elements);

  // Evento disparado pelo painel ao conectar 2 nós
  onConnect: ({ source, target, sourceHandle, targetHandle }: Connection) => {
    get().addEdge(source!, target!, sourceHandle, targetHandle);
  },

  onDrop: (event: any) => {
    event.preventDefault();

    if (get().running) {
      useNotificationStore.getState().warn('Application is running. Stop application first.');
      return;
    }

    let component = null;

    const appAction = event.dataTransfer.getData('application/menuaction');
    if (appAction) {
      component = get().nodeTypesByMenu[appAction] as typeof CVFComponent;
    }
    const customComponent = event.dataTransfer.getData('application/customcomponent');
    if (customComponent) {
      component = get().nodeTypes[customComponent] as typeof CVFComponent;
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
    event.dataTransfer.setData('application/menuaction', menuAction.title);
    event.dataTransfer.effectAllowed = 'move';
  },

  // Evento disparado ao arrastar um custom componente do menu
  onDragStartCustom: (event: any, customComp: CustomComponent) => {
    event.dataTransfer.setData('application/customcomponent', customComp.name);
    event.dataTransfer.effectAllowed = 'move';
  },

  onNodeDragStop: (event: any, node: any) => {
    event.preventDefault();
    const storeNode = get().elements.find((_) => _.id === node.id) as CVFNode;
    if (storeNode) {
      storeNode.position = node.position;
    }
    get().storage();
  },

  onNodeContextMenu: (event: any, node: any) => {
    event.preventDefault();
    console.log('context menu:', node);
  },

  nodes: (): Array<CVFNode> => {
    return get().elements.filter((el) => !(el as OCVFEdge).sourceHandle) as Array<CVFNode>;
  },

  edges: (): Array<OCVFEdge> => {
    return get().elements.filter((el) => (el as OCVFEdge).sourceHandle) as Array<OCVFEdge>;
  },
}));
