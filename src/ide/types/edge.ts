import { Edge } from 'react-flow-renderer/nocss';
import { CVFNodeProcessor, NodeSourceDef } from './node';

export class CVFEdgeData {
  // Origem da aresta
  sourceProcessor: CVFNodeProcessor;
  // Indíce da origem
  sourceIdx: number;

  // Destino da aresta
  targetProcessor: CVFNodeProcessor;
  // Indíce do destino
  targetIdx: number;

  constructor(source: CVFNodeProcessor, target: CVFNodeProcessor, sourceIdx: number, targetIdx: number) {
    this.sourceProcessor = source;
    this.targetProcessor = target;
    this.sourceIdx = sourceIdx;
    this.targetIdx = targetIdx;
  }

  get source(): NodeSourceDef {
    return this.sourceProcessor.sources[this.sourceIdx];
  }
}

export interface OCVFEdge extends Edge<CVFEdgeData> {
  data: CVFEdgeData;
}
