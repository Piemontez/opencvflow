import { PropertyType } from 'renderer/types/property';
import { CVFFormEventHandler } from '../index';
import { CVFOptionValue } from "./CVFOptionValue";

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
  //propriedades do campo boolean
  checked?: boolean;
  //propriedades do campo selecionável
  multi?: boolean;
  header?: string[];
  options?: CVFOptionValue[];
  //control
  controlClassName?: string;

  onChange?: CVFFormEventHandler;
};
