import NodeStore from 'renderer/contexts/NodeStore';
import { toJS } from 'mobx';
import { CVFNodeProcessor } from 'renderer/types/node';
import { SaveContent } from 'renderer/types/save-content';
import { OCVElements, OCVFlowElement } from 'renderer/types/ocv-elements';

const nodeStoreToJson = (): SaveContent => {
  const elements: OCVElements = toJS(NodeStore.elements);
  const elementsUsefulData = elements.map(
    ({ data, ...rest }) =>
      ({
        data: (data as CVFNodeProcessor)?.propertiesMap,
        ...rest,
      } as OCVFlowElement)
  );
  return { elements: elementsUsefulData };
};

export default nodeStoreToJson;
