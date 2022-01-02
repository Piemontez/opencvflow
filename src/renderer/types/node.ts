import { ElementId, Node, XYPosition } from 'react-flow-renderer';
import { CVFEdgeData } from './edge';
import { v4 as uuidv4 } from 'uuid';

type Mat = Uint8Array;

/**
 * Classe com definições
 */
export abstract class CVFNodeProcessor {
  //Nome do processador
  name: string = '';
  //Titulo exibido em tela
  get title(): string {
    return this.name;
  }

  edges: Array<CVFEdgeData> = [];
  //Contéudo da primeira saída
  sources: Array<Mat> = [];

  //Conteúdo exebido pelo processador
  //Por padrão exibe o conteúdo do primeiro source
  get output(): Mat {
    return this.sources?.[0] || [];
  }

  //Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
  async start(): Promise<void> {}
  //Função chamada a cada novo ciclo de operação
  async proccess(): Promise<void> {}
  //Função chamada ao para o processamento. Chamada uma única vez
  async stop(): Promise<void> {}
}

/**
 * Definição dos nós vinculados ao React-Flow-Renderes
 * Classe utilizada internamente
 */
export class CVFNode implements Node<CVFNodeProcessor> {
  id: ElementId;
  position: XYPosition;
  data?: CVFNodeProcessor;

  constructor() {
    this.id = uuidv4();
    this.position = { x: 0, y: 0 };
  }
}
