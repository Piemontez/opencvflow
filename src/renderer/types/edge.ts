import { Edge } from 'react-flow-renderer';
import { CVFNodeProcessor } from './node';

export class CVFEdgeData {
  //Origem da aresta
  source?: CVFNodeProcessor;
  //Destino da aresta
  target?: CVFNodeProcessor;

  constructor(source?: CVFNodeProcessor, target?: CVFNodeProcessor) {
    this.source = source;
    this.target = target;
  }
}

export interface OCVFEdge extends Edge<CVFEdgeData> {
  data: CVFEdgeData;
}
