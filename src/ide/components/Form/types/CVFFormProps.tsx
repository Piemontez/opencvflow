import { PropertyType } from '../../../types/PropertyType';
import { CVFFormEventHandler } from '../index';
import { CVFOptionValue } from './CVFOptionValue';

/**
 * Propriedades do formulário
 */

export declare type CVFFormProps = {
  type: PropertyType;
  name: string;
  title?: string;
  placeholder?: string;
  value?: any | [any] | null;
  description?: string;
  disabled?: boolean;

  filters?: any;
  //propriedade do formGroup
  groupAs?: any;
  column?: any;
  //propriedades do campo text
  multiline?: number;
  //propriedades do campo selecionável
  multi?: boolean;
  header?: string[];
  options?: CVFOptionValue[];
  //control
  controlClassName?: string;
  //range controls
  min: number;
  max: number;

  onChange?: CVFFormEventHandler;
};
