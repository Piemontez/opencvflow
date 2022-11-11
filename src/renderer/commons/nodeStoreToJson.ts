import NodeStore from 'renderer/contexts/NodeStore';
import CustomComponentStore from 'renderer/contexts/CustomComponentStore';
import { toJS } from 'mobx';
import { CVFNodeProcessor } from 'renderer/types/node';
import { SaveContent } from 'renderer/types/save-content';
import { OCVElements, OCVFlowElement } from 'renderer/types/ocv-elements';
import { CustomComponent } from 'renderer/types/custom-component';

const nodeStoreToJson = (): SaveContent => {
  const customComponents: Array<CustomComponent> = toJS(
    CustomComponentStore.customComponents
  );

  const elements: OCVElements = toJS(NodeStore.elements);
  const elementsUsefulData = elements.map(
    ({ data, ...rest }) =>
      ({
        data: (data as CVFNodeProcessor)?.propertiesMap,
        ...rest,
      } as OCVFlowElement)
  );

  return {
    custom: { components: customComponents },
    elements: elementsUsefulData,
  };
};

export default nodeStoreToJson;
