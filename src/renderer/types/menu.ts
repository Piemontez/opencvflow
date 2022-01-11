import React, { MouseEventHandler } from 'react';

type MenuBaseProps = {
  tabTitle?: string;
  order?: number;
  draggable?: boolean;
  action?: MouseEventHandler<HTMLButtonElement>;
};

export type MenuWithStringTitleProps = {
  title: string;
};

export type MenuWithElementTitleProps = {
  name: string;
  title: React.ReactElement;
};

export type MenuActionProps =
  | (MenuBaseProps & MenuWithStringTitleProps)
  | (MenuBaseProps & MenuWithElementTitleProps);

export type ComponentMenuAction =
  | Omit<MenuBaseProps & MenuWithStringTitleProps, 'action'>
  | Omit<MenuBaseProps & MenuWithElementTitleProps, 'action'>;
