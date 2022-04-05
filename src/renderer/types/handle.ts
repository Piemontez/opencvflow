import { HandleProps, Position } from 'react-flow-renderer/nocss';

type CVFHandleProps = {
  title: string;
} & Omit<HandleProps, 'type'>;

// Propriedades dos handles que serão conectados ao componente
export declare type TargetHandle = {
  // Posições que os handles ficarão no componente
  position: Position.Left | Position.Top;
} & CVFHandleProps;

// Propriedades dos handles que serão disparados do componente
export declare type SourceHandle = {
  // Posições que os handles ficarão no componente
  position: Position.Bottom | Position.Right;
} & CVFHandleProps;
