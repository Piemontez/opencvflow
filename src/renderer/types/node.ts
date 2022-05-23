import { Node } from 'react-flow-renderer/nocss';
import { CVFEdgeData } from './edge';
import { Mat, MatVector, Point } from 'opencv-ts';
import { NodeProperty } from './property';
import { Moments } from 'opencv-ts/src/core/Moments';

export type NodeSourceDef =
  | Mat
  | MatVector
  | Point
  | Array<Point>
  | Moments
  | Array<Moments>
  | number;

/**
 * Classe com definições
 */
export abstract class CVFNodeProcessor {
  // Definições das propriedades do nó.
  static properties: Array<NodeProperty> = [];
  // Arestas conectadas à entreda
  inEdges: Array<CVFEdgeData | null> = [];
  // Arestas conectadas à saída
  outEdges: Array<CVFEdgeData | null> = [];
  // Saídas
  sources: Array<NodeSourceDef> = [];
  // Exibe mensagem de erro dentro do widget
  errorMessage?: string;

  // Exibe o conteudo em tela
  output: (mat: Mat) => void = () => {};
  // Exibe adiciona uma mensagem na tela (uso interno)
  outputMsg: (msg: string) => void = () => {};

  get edges(): Array<CVFEdgeData | null> {
    return this.inEdges.concat(this.outEdges);
  }

  get inputs(): Array<NodeSourceDef> {
    return this.inEdges.map((edge) => edge!.source);
  }

  get inputsAsMat(): Array<Mat> {
    return this.inEdges.map((edge) => edge!.source as Mat);
  }

  body(): JSX.Element | void {}
  // Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
  async start(): Promise<void> {}
  // Função chamada a cada novo ciclo de operação
  async proccess(): Promise<void> {}
  // Função chamada antes de finalizar o processamento. Chamada uma única vez
  async stop(): Promise<void> {}

  get propertiesMap(): Readonly<any> {
    const curElTypeof = this?.constructor as typeof CVFNodeProcessor;
    const map: any = {};
    curElTypeof?.properties?.forEach(({ name }) => {
      map[name] = (this as any)[name];
    });

    return map;
  }
}

export class EmptyNodeProcessor extends CVFNodeProcessor {}

/**
 * Definição dos nós vinculados ao React-Flow-Renderes
 * Classe utilizada internamente
 */
export interface CVFNode extends Node<CVFNodeProcessor> {
  data: CVFNodeProcessor;
}
