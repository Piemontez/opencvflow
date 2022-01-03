export declare type MenuAction = {
  tabTitle: string;
  title: string;
  order?: number;
  action?: Function;
};

export declare type ComponentMenuAction = {} & MenuAction;
