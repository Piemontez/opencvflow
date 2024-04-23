import { create } from 'zustand';
import { useCustomComponentStore } from './CustomComponentStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { SampleTemplate } from '../../core/types/sample-template';
import { useNotificationStore } from '../components/Notification/store';

type NewModalState = {
  projectName: string;
  isShow: boolean;
  groups: Array<string>;
  groupSelected: string;
  templates: Array<SampleTemplate>;
  templateSelected: SampleTemplate | null;

  show: () => void;
  close: () => void;
  changeProjectName: (name: string) => void;

  addTemplate: (template: SampleTemplate) => void;
  changeTemplate: (template: SampleTemplate) => void;
  changeGroup: (group: string) => void;
  create: () => void;
};

const emptyTemplate: SampleTemplate = {
  group: 'Basic',
  title: 'Empty Project',
  action: () => {},
};

export const useNewModalStore = create<NewModalState>((set, get) => ({
  projectName: '',
  isShow: false,
  groups: [emptyTemplate.group],
  groupSelected: emptyTemplate.group,
  templates: [emptyTemplate],
  templateSelected: emptyTemplate,

  show: () => {
    set({ projectName: '', isShow: true });
  },

  close: () => {
    set({ isShow: false });
  },

  addTemplate: (template: SampleTemplate) => {
    set({
      groups: [...new Set([...get().groups, template.group])],
      templates: [...get().templates, template],
    });
  },

  changeProjectName: (name: string) => {
    set({ projectName: name });
  },

  changeTemplate: (template: SampleTemplate) => {
    set({ templateSelected: template });
  },

  changeGroup: (group: string) => {
    set({ groupSelected: group, templateSelected: null });
  },

  create: () => {
    if (!get().templateSelected) {
      useNotificationStore.getState().info('Select same template.');
      return;
    }

    useCustomComponentStore.getState().clear();
    useNodeStore.getState().clear();
    useNodeStore.getState().storage();

    get().templateSelected!.action();

    get().close();
  },
}));
