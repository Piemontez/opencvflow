import { Node } from 'react-flow-renderer';
import { CVFEdgeData } from './edge';
import { Mat } from 'opencv-ts';

/**
 * Classe com definições
 */
export abstract class CVFNodeProcessor {
  edges: Array<CVFEdgeData> = [];
  //Saídas
  sources: Array<Mat> = [];
  //Exibe mensagem de erro dentro do widget
  errorMessage?: string;

  //Exibe o conteudo em tela
  output: (mat: Mat) => void = () => {};

  get inputs(): Array<CVFNodeProcessor> {
    return this.edges
      .filter((edge) => edge.target === this)
      .map((edge) => edge.source);
  }

  body(): JSX.Element | void {}
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
export interface CVFNode extends Node<CVFNodeProcessor> {
  data: CVFNodeProcessor;
}
