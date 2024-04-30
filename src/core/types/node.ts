import { Node } from 'reactflow';
import { CVFEdgeData } from './edge';
import { Mat, MatVector, Point } from 'opencv-ts';
import { PropertyType } from '../../ide/types/PropertyType';
import { Moments } from 'opencv-ts/src/core/Moments';
import { createRef, RefObject } from 'react';
import { NonFunctionProperties } from './non-function-properties';

export type NodeSourceDef = Mat | MatVector | Point | Array<Point> | Moments | Array<Moments> | number;

export type NodeProperty = {
  type: PropertyType;
  name: string;
  title?: string;
};

/**
 * Classe com definições
 */
export abstract class CVFNodeProcessor {
  // Definições das propriedades do nó.
  properties: Array<NodeProperty> = [];
  // Ponteiro para o componente de tela
  componentPointer: RefObject<any> = createRef();

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

  header(): JSX.Element | null {
    return null;
  }
  body(): JSX.Element | null {
    return null;
  }

  // Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
  async start(): Promise<void> {}
  // Função chamada a cada novo ciclo de operação
  async proccess(): Promise<void> {}
  // Função chamada antes de finalizar o processamento. Chamada uma única vez
  async stop(): Promise<void> {}
  // Função chamada após anterar uma propriedade
  async propertyChange(_name: string, _value: any): Promise<void> {}

  get propertiesMap(): Readonly<any> {
    const map: any = {};
    this?.properties?.forEach(({ name }) => {
      map[name] = (this as any)[name];
    });

    return map;
  }
}

export type CVFNodeData = {
  processor: CVFNodeProcessor;
};

/**
 * Definição dos nós vinculados ao React-Flow-Renderes
 * Classe utilizada internamente
 */
export type CVFNode = Node<CVFNodeData>;
export type CVFNodeProperties = Node<{ processor: NonFunctionProperties<CVFNodeProcessor> }>;
