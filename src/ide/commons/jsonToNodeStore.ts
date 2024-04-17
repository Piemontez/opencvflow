import NodeStore from '../contexts/NodeStore';
import CustomComponentStore from '../contexts/CustomComponentStore';
import { CVFNode } from '../types/node';
import { OCVFEdge } from '../types/edge';
import { SaveContent } from '../types/save-content';
import cv from 'opencv-ts';
import GCStore from '../contexts/GCStore';
import { useNotificationStore } from '../components/Notification/store';

const jsonToNodeStore = (json: SaveContent) => {
  const { custom, elements } = json || {};

  // Carrega os tipo de nó customizados
  if (custom?.components) {
    for (const customComponent of custom.components) {
      CustomComponentStore.add(customComponent);
    }
  }

  // Carrega os Nodes
  if (Array.isArray(elements)) {
    const components = (elements as Array<any>)
      // Filtra apenas os componentes nó
      .filter((el) => !((el as OCVFEdge).source && (el as OCVFEdge).target))
      // Realiza alguma validações
      .filter(({ type }) => {
        if (type) {
          const component = NodeStore.getNodeType(type);
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
          const component = NodeStore.getNodeType(element.type);
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

    NodeStore.elements = components;

    // Adiciona as conecções
    (elements as Array<any>)
      // Filtra apenas as arestas
      .filter((el) => (el as OCVFEdge).source && (el as OCVFEdge).target)
      .forEach(({ data, ...rest }) => {
        NodeStore.onConnect(rest as OCVFEdge);
      });
  }
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
