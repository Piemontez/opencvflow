export enum PropertyType {
  Text,
  Integer,
  Decimal,
  Boolean,
  Choice,
  MultiChoice
}

export declare type NodeProperty = {
  type: PropertyType;
  name: string;
  title?: string;
};
