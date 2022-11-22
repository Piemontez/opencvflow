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
      // Filtra apenas os componentes nó
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
      .map((element: CVFNode) => {
        const properties: any = element.data.processor;

        if (element.type) {
          const component = NodeStore.getNodeType(element.type);
          if (component) {
            const processor: any = new component.processor();
            element.data.processor = processor;

            Object.keys(
              (element as CVFNode).data.processor.propertiesMap
            ).forEach((key) => {
              if (properties && properties[key] !== undefined) {
                if (typeof processor[key] === 'object') {
                  Object.assign(processor[key], properties[key]);
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

export default jsonToNodeStore;
