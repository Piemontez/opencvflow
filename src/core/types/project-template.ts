/**
 * Definição dos components de exemplos, exibidos no modal de novo projeto.
 */

export type ProjectTemplate = {
  group: string;
  title: string;
  onClick?: () => void;
  action: () => void;
};
