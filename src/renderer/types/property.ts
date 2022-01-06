export enum PropertyType {
  Text,
  Integer,
  Decimal,
  Boolean,
  Choice,
  MultiChoice,
  BooleanMatrix,
  IntMatrix,
  DoubleMatrix,
  //
  BorderType = 1000
}

export declare type NodeProperty = {
  type: PropertyType;
  name: string;
  title?: string;
};
