import { Node } from 'react-flow-renderer';
import { CVFEdgeData } from './edge';
import cv from 'opencv4nodejs';

/**
 * Classe com definições
 */
export abstract class CVFNodeProcessor {
  edges: Array<CVFEdgeData> = [];
  //Saídas
  sources: Array<cv.Mat> = [];

  //Conteúdo exebido pelo processador
  //Por padrão exibe o conteúdo do primeiro source
  get output(): cv.Mat {
    return this.sources?.[0];
  }

  //Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
  async start(): Promise<void> {}
  //Função chamada a cada novo ciclo de operação
  async proccess(): Promise<void> {}
  //Função chamada ao para o processamento. Chamada uma única vez
  async stop(): Promise<void> {}
}

export class EmptyNodeProcessor extends CVFNodeProcessor {}

/**
 * Definição dos nós vinculados ao React-Flow-Renderes
 * Classe utilizada internamente
 */
export interface CVFNode extends Node<CVFNodeProcessor> {}
