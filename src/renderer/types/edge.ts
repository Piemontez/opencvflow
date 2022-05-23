import { Edge } from 'react-flow-renderer/nocss';
import { CVFNodeProcessor } from './node';

export class CVFEdgeData {
  // Origem da aresta
  source: CVFNodeProcessor;
  // Indíce da origem
  sourceIdx: number;

  // Destino da aresta
  target: CVFNodeProcessor;
  // Indíce do destino
  targetIdx: number;

  constructor(
    source: CVFNodeProcessor,
    target: CVFNodeProcessor,
    sourceIdx: number,
    targetIdx: number
  ) {
    this.source = source;
    this.target = target;
    this.sourceIdx = sourceIdx;
    this.targetIdx = targetIdx;
  }
}

export interface OCVFEdge extends Edge<CVFEdgeData> {
  data: CVFEdgeData;
}
