import { Node } from 'react-flow-renderer';
import { OCVFEdge } from './edge';

type Mat = Uint8Array;

class CVFNodeData {
  edges: Array<OCVFEdge> = [];
  outputs: Array<Mat> = [];

  //Função chamada ao iniciar o processamento(clicar em run). Chamada uma única vez
  async start(): Promise<void> {}
  //Função chamada a cada novo ciclo de operação
  async proccess(): Promise<void> {}
  //Função chamada ao para o processamento. Chamada uma única vez
  async stop(): Promise<void> {}
}

export declare type OCVFNode = Node<CVFNodeData>;
