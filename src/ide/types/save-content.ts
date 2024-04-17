import { CustomComponent } from './custom-component';
import { OCVFEdge } from './edge';
import { CVFNode } from './node';

export type SaveContent = SaveContentV0_10 | SaveContentV0_9;

export type SaveContentV0_10 = {
  // 0.10.* version or more
  custom: {
    components: Array<CustomComponent>;
  };
  nodes: Array<CVFNode>;
  edges: Array<OCVFEdge>;
};

export type SaveContentV0_9 = {
  // 0.9.* version or less
  custom: {
    components: Array<CustomComponent>;
  };
  elements: Array<CVFNode | OCVFEdge>;
};
