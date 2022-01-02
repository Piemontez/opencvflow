import { Edge } from 'react-flow-renderer';

export class CVFEdgeData {
  source?: CVFEdgeData;
  target?: CVFEdgeData;

  CVFEdgeData(source?: CVFEdgeData, target?: CVFEdgeData) {
    this.target = target;
    this.source = source;
  }
}

export declare type OCVFEdge = Edge<CVFEdgeData>;
