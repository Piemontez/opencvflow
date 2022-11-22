import NodeStore from 'renderer/contexts/NodeStore';
import CustomComponentStore from 'renderer/contexts/CustomComponentStore';
import { toJS } from 'mobx';
import { CVFNodeData } from 'renderer/types/node';
import { SaveContent } from 'renderer/types/save-content';
import { OCVElements } from 'renderer/types/ocv-elements';
import { CustomComponent } from 'renderer/types/custom-component';

const nodeStoreToJson = (): SaveContent => {
  const customComponents: Array<CustomComponent> = toJS(
    CustomComponentStore.customComponents
  );

  const elements: OCVElements = toJS(NodeStore.elements);
  const elementsUsefulData = elements.map((element) => {
    const replace: any = {};

    if ((element.data as CVFNodeData).processor) {
      replace.data = {
        processor: (element.data as CVFNodeData).processor.propertiesMap,
      };
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

export default nodeStoreToJson;
