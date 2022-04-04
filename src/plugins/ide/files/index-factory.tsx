import { MenuActionProps } from 'renderer/types/menu';

const EmptyAAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'emptyA',
  title: 'Empty A',
  action: () => {},
};
const EmptyBAction: MenuActionProps = {
  tabTitle: 'File',
  name: 'emptyB',
  title: 'Empty B',
  action: () => {},
};

export { EmptyAAction, EmptyBAction };
