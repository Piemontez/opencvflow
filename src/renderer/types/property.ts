export enum PropertyType {
  // IDE Types
  Label,
  Text,
  Integer,
  Decimal,
  Boolean,
  Choice,
  MultiChoice,
  OneZeroMatrix,
  IntMatrix,
  DoubleMatrix,
  FileUrl,
  // OpenCV Types
  Size = 1000,
  Point,
  Scalar,
  ColorConversionCodes,
  BorderType,
  MorphTypes,
  ThresholdTypes,
  DistanceTypes,
  DistanceTransformMasks = PropertyType.Integer,
}

export declare type NodeProperty = {
  type: PropertyType;
  name: string;
  title?: string;
};
