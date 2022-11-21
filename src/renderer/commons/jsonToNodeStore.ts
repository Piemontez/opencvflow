import NodeStore from 'renderer/contexts/NodeStore';
import CustomComponentStore from 'renderer/contexts/CustomComponentStore';
import { CVFNode } from 'renderer/types/node';
import { OCVFEdge } from 'renderer/types/edge';
import { SaveContent } from 'renderer/types/save-content';
import { notify } from 'renderer/components/Notification';

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
      // Filtra apenas componentes
      .filter((el) => !((el as OCVFEdge).source && (el as OCVFEdge).target))
      // Realiza alguma validações
      .filter(({ type }) => {
        if (type) {
          const component = NodeStore.getNodeType(type);
          if (!component) {
            notify.warn(`Node type "${type} not found."`);

            return false;
          }
        }
        return true;
      })
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
      })
      .filter((element) => element);

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
