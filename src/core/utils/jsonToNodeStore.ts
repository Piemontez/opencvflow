import { CVFNode, CVFNodeProperties } from '../types/node';
import { OCVFEdgeProperties } from '../types/edge';
import { SaveContent, SaveContentLoaded, SaveContentV0_10, SaveContentV0_9 } from '../../ide/types/SaveContent';
import cv from 'opencv-ts';
import GCStore from '../contexts/GCStore';
import { useNotificationStore } from '../../ide/components/Notification/store';
import { useNodeStore } from '../contexts/NodeStore';

const jsonToNodeStore = (save: SaveContent): SaveContentLoaded => {
  const { elements } = (save || {}) as SaveContentV0_9;
  let { nodes, edges } = (save || {}) as SaveContentV0_10;

  const saveLoaded: SaveContentLoaded = {
    // Dados carregados do arquivo
    ...(save as SaveContentV0_10),
    // Limpa os dados, desnecessários para processamento
    nodes: [],
    edges: [],
    nodesLoaded: [],
    edgesLoaded: [],
  };

  // Se versão antiga, converte elemntos
  if (Array.isArray(elements)) {
    nodes = (elements as Array<any>)
      // Filtra apenas os componentes nó
      .filter((el) => !((el as OCVFEdgeProperties).source && (el as OCVFEdgeProperties).target));

    edges = (elements as Array<any>)
      // Filtra apenas as arestas
      .filter((el) => (el as OCVFEdgeProperties).source && (el as OCVFEdgeProperties).target);
  }

  // Carrega os Nodes
  if (Array.isArray(nodes)) {
    saveLoaded.nodesLoaded = nodes
      // Realiza alguma validações
      .filter(({ type }) => {
        if (type) {
          if (!useNodeStore.getState().hasNodeType(type)) {
            useNotificationStore.getState().warn(`Node type "${type} not found."`);

            return false;
          }
        }
        return true;
      })
      .map((element: CVFNodeProperties): CVFNode => {
        const properties: any = element.data.processor;

        if (element.type) {
          const component = useNodeStore.getState().getNodeType(element.type);
          if (component) {
            const processor: any = new component.processor();
            element.data.processor = processor;

            Object.keys((element as CVFNodeProperties).data.processor.propertiesMap).forEach((key) => {
              if (properties && properties[key] !== undefined) {
                if (typeof processor[key] === 'object') {
                  const className = processor[key].constructor.name;
                  if (className === 'Mat' && processor[key].constructor === cv.Mat) {
                    GCStore.add(processor[key], -100);
                    processor[key] = jsonMatToMat(properties[key]);
                  } else {
                    Object.assign(processor[key], properties[key]);
                  }
                } else {
                  processor[key] = properties[key];
                }
              }
            });
          }
        }
        return element as CVFNode;
      })
      .filter((element) => element);
  }

  if (Array.isArray(edges)) {
    saveLoaded.edgesLoaded = edges.map(({ data, ...rest }) => rest);
  }

  return saveLoaded;
};

const jsonMatToMat = (json: any) => {
  const mat = new cv.Mat(json.rows, json.cols, json.type);
  for (let j = 0; j < json.rows; j++)
    for (let k = 0; k < json.cols; k++) {
      const pos = json.cols * j + k;
      mat.ptr(j, k)[0] = json.data[pos];
    }
  return mat;
};

export default jsonToNodeStore;
