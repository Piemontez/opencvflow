export enum PropertyType {
  Text,
  Integer,
  Decimal,
  Boolean,
  Choice,
  MultiChoice,
  OneZeroMatrix,
  IntMatrix,
  DoubleMatrix,
  //
  Size = 1000,
  Point,
  Scalar,
  ColorConversionCodes,
  BorderType
}

export declare type NodeProperty = {
  type: PropertyType;
  name: string;
  title?: string;
};
