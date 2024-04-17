import { CVFNode } from '../../core/types/node';
import { OCVFEdge } from '../../core/types/edge';
import { SaveContent, SaveContentV0_10, SaveContentV0_9 } from '../types/save-content';
import cv from 'opencv-ts';
import GCStore from '../../core/contexts/GCStore';
import { useNotificationStore } from '../components/Notification/store';
import { useNodeStore } from '../../core/contexts/NodeStore';

type SaveContentLoaded = {
  nodesLoaded: Array<CVFNode>;
  edgesLoaded: Array<OCVFEdge>;
} & SaveContent;

const jsonToNodeStore = (save: SaveContent): SaveContentLoaded => {
  const { elements } = (save || {}) as SaveContentV0_9;
  let { nodes, edges } = (save || {}) as SaveContentV0_10;

  const saveLoaded: SaveContentLoaded = { ...save, nodesLoaded: [], edgesLoaded: [] };

  // Se versão antiga, converte elemntos
  if (Array.isArray(elements)) {
    nodes = (elements as Array<any>)
      // Filtra apenas os componentes nó
      .filter((el) => !((el as OCVFEdge).source && (el as OCVFEdge).target));

    edges = (elements as Array<any>)
      // Filtra apenas as arestas
      .filter((el) => (el as OCVFEdge).source && (el as OCVFEdge).target);
  }

  // Carrega os Nodes
  if (Array.isArray(nodes)) {
    saveLoaded.nodesLoaded = nodes
      // Realiza alguma validações
      .filter(({ type }) => {
        if (type) {
          const component = useNodeStore.getState().getNodeType(type);
          if (!component) {
            useNotificationStore.getState().warn(`Node type "${type} not found."`);

            return false;
          }
        }
        return true;
      })
      .map((element: CVFNode) => {
        const properties: any = element.data.processor;

        if (element.type) {
          const component = useNodeStore.getState().getNodeType(element.type);
          if (component) {
            const processor: any = new component.processor();
            element.data.processor = processor;

            Object.keys((element as CVFNode).data.processor.propertiesMap).forEach((key) => {
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
        return element;
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
