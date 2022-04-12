import NodeStore from 'renderer/contexts/NodeStore';
import { toJS } from 'mobx';
import { OCVFEdge } from 'renderer/types/edge';
import { CVFNode, CVFNodeProcessor } from 'renderer/types/node';

const nodeStoreToJson = (): any => {
  const elements: Array<CVFNode | OCVFEdge> = toJS(NodeStore.elements);
  const elementsUsefulData = elements.map(({ data, ...rest }) => ({
    data: (data as CVFNodeProcessor)?.propertiesMap,
    ...rest,
  }));
  return { elements: elementsUsefulData };
};

export default nodeStoreToJson;
