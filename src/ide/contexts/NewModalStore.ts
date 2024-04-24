import { create } from 'zustand';
import { useCustomComponentStore } from './CustomComponentStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { useNotificationStore } from '../components/Notification/store';
import { useProjectStore } from './ProjectStore';

type NewModalState = {
  projectName: string;
  isShow: boolean;
  groups: Array<string>;
  groupSelected: string;
  templates: Array<ProjectTemplate>;
  templateSelected: ProjectTemplate | null;

  show: () => void;
  close: () => void;
  changeProjectName: (name: string) => void;

  addTemplate: (template: ProjectTemplate) => void;
  changeTemplate: (template: ProjectTemplate | null) => void;
  changeGroup: (group: string) => void;
  create: () => void;
};

export const useNewModalStore = create<NewModalState>((set, get) => ({
  projectName: '',
  isShow: false,
  groups: [],
  groupSelected: 'Basic',
  templates: [],
  templateSelected: null,

  show: () => {
    set({ projectName: '', isShow: true });
  },

  close: () => {
    set({ isShow: false });
  },

  addTemplate: (template: ProjectTemplate) => {
    set({
      groups: [...new Set([...get().groups, template.group])],
      templates: [...get().templates, template],
    });
  },

  changeProjectName: (name: string) => {
    set({ projectName: name });
  },

  changeTemplate: (template: ProjectTemplate | null) => {
    if (template?.onClick) {
      template.onClick();
    }

    set({ templateSelected: template });
  },

  changeGroup: (group: string) => {
    set({ groupSelected: group, templateSelected: null });
  },

  create: () => {
    const { projectName, templateSelected } = get();
    if (!projectName) {
      useNotificationStore.getState().info('Type a project name.');
      return;
    }
    if (!templateSelected) {
      useNotificationStore.getState().info('Select same template.');
      return;
    }

    useProjectStore.getState().changeName(projectName);
    useCustomComponentStore.getState().clear();
    useNodeStore.getState().clear();
    useNodeStore.getState().storage();

    get().templateSelected!.action();

    get().close();
  },
}));
