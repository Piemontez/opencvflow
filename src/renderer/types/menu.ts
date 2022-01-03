import { MouseEventHandler } from 'react';

export type MenuAction = {
  tabTitle: string;
  title: string;
  order?: number;
  draggable?: boolean;
  action?: MouseEventHandler<HTMLButtonElement>;
};

export type ComponentMenuAction = Omit<MenuAction, 'action'>;
