import NodeStore from '../contexts/NodeStore';
import CustomComponentStore from '../contexts/CustomComponentStore';
import { CVFNodeData } from '../types/node';
import { SaveContent } from '../types/save-content';
import { OCVElements } from '../types/ocv-elements';
import { CustomComponent } from '../types/custom-component';
import cv, { Mat } from 'opencv-ts';

const nodeStoreToJson = (): SaveContent => {
  const customComponents: Array<CustomComponent> = CustomComponentStore.customComponents;
  const elements: OCVElements = NodeStore.elements;
  const elementsUsefulData = elements.map((element) => {
    const replace: any = {};

    if ((element.data as CVFNodeData).processor) {
      replace.data = {
        processor: (element.data as CVFNodeData).processor.propertiesMap,
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
      ...element,
      ...replace,
    };
  });

  return {
    custom: { components: customComponents },
    elements: elementsUsefulData,
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
