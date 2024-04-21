import CustomComponentStore from '../../ide/contexts/CustomComponentStore';
import { CVFNodeData } from '../types/node';
import { SaveContent } from '../../ide/types/SaveContent';
import { CustomNodeType } from '../types/custom-node-type';
import cv, { Mat } from 'opencv-ts';
import { NodeState } from '../contexts/NodeStore';

const nodeStoreToJson = (state: NodeState): SaveContent => {
  const customComponents: Array<CustomNodeType> = CustomComponentStore.customComponents;
  const { nodes, edges } = state;

  const nodesUsefulData = nodes.map((node) => {
    const replace: any = {};

    if ((node.data as CVFNodeData).processor) {
      replace.data = {
        processor: (node.data as CVFNodeData).processor.propertiesMap,
      };

      for (const key in replace.data.processor) {
        if (Object.prototype.hasOwnProperty.call(replace.data.processor, key)) {
          const value = replace.data.processor[key];
          if (typeof value === 'object') {
            const className = value.constructor.name;
            if (className === 'Mat' && value.constructor === cv.Mat) {
              replace.data.processor[key] = matToJson(value);
            }
          }
        }
      }
    } else {
      replace.data = {};
    }

    return {
      ...node,
      ...replace,
    };
  });

  const edgesUsefulData = edges.map((edge) => {
    const replace = { data: undefined };
    return {
      ...edge,
      ...replace,
    };
  });

  return {
    custom: { components: customComponents },
    nodes: nodesUsefulData,
    edges: edgesUsefulData,
  };
};

const matToJson = (value: Mat) => {
  return {
    rows: value.rows,
    cols: value.cols,
    type: value.type(),
    channels: value.channels(),
    data: value.data,
  };
};

export default nodeStoreToJson;