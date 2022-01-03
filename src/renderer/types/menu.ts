export type MenuAction = {
  tabTitle: string;
  title: string;
  order?: number;
  action?: Function;
};

export type ComponentMenuAction = Omit<MenuAction, "action">;
