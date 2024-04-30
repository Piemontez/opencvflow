import { CustomNodeType } from '../../core/types/custom-node-type';
import { OCVFEdge, OCVFEdgeProperties } from '../../core/types/edge';
import { CVFNode, CVFNodeProperties } from '../../core/types/node';

export type SaveContentLoaded = {
  nodesLoaded: Array<CVFNode>;
  edgesLoaded: Array<OCVFEdge>;
} & SaveContentLastVersion;

export type SaveContent = SaveContentV0_10 | SaveContentV0_9;
export type SaveContentLastVersion = SaveContentV0_10;

export type SaveContentV0_10 = {
  projectName: string;
  // 0.10.* version or more
  custom: {
    components: Array<CustomNodeType>; // From CustomComponentStore
  };
  nodes: Array<CVFNodeProperties>; // From NodeStore
  edges: Array<OCVFEdgeProperties>; // From NodeStore
};

export type SaveContentV0_9 = {
  // 0.9.* version or less
  custom: {
    components: Array<CustomNodeType>;
  };
  elements: Array<CVFNodeProperties | OCVFEdgeProperties>;
};
