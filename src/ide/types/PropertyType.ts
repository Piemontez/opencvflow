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
  DataTypes,
  BorderType,
  MorphTypes,
  ThresholdTypes,
  DistanceTypes,
  NormTypes,
  DistanceTransformMasks = PropertyType.Integer,
}

