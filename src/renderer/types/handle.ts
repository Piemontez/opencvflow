import { HandleProps, Position } from 'react-flow-renderer';

type CVFHandleProps = {
  title: string;
} & HandleProps;

//Propriedades dos handles que serão conectados ao componente
export declare type TargetHandle = {
  //Posições que os handles ficarão no componente
  position: Position.Left | Position.Top;
} & CVFHandleProps;

//Propriedades dos handles que serão disparados do componente
export declare type SourceHandle = {
  //Posições que os handles ficarão no componente
  position: Position.Bottom | Position.Right;
} & CVFHandleProps;
