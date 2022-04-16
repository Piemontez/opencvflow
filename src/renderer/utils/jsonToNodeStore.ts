import NodeStore from 'renderer/contexts/NodeStore';
import { CVFNode } from 'renderer/types/node';
import { OCVFEdge } from 'renderer/types/edge';

const jsonToNodeStore = (json: any) => {
  // Adiciona os componentes
  const { elements } = json || {};
  if (Array.isArray(elements)) {
    const components = (elements as Array<any>)
      .filter((el) => !((el as OCVFEdge).source && (el as OCVFEdge).target))
      .map(({ data, ...rest }) => {
        const element = rest as CVFNode | OCVFEdge;
        if (element.type) {
          const component = NodeStore.getNodeType(element.type);
          if (component) {
            element.data = new component.processor();

            Object.keys(element.data.propertiesMap).forEach((key) => {
              if (data && data[key] !== undefined) {
                const el = element.data as any;
                if (typeof el[key] === 'object') {
                  Object.assign(el[key], data[key]);
                } else {
                  el[key] = data[key];
                }
              }
            });
          }
        }
        return element;
      });
    NodeStore.elements = components;

    // Adiciona as conecções
    (elements as Array<any>)
      .filter((el) => (el as OCVFEdge).source && (el as OCVFEdge).target)
      .forEach(({ data, ...rest }) => {
        NodeStore.onConnect(rest as OCVFEdge);
      });
  }
};

export default jsonToNodeStore;
