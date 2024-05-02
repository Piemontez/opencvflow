import { create } from 'zustand';
import { CustomNodeType } from '../../core/types/custom-node-type';
import { CVFComponent, CVFIOComponent } from '../components/NodeComponent';
import { PropertyType } from '../types/PropertyType';
import { CVFNodeProcessor } from '../../core/types/node';
import GCStore from '../../core/contexts/GCStore';
import { useNodeStore } from '../../core/contexts/NodeStore';
import cv from 'opencv-ts';

type CustomComponentState = {
  customComponents: Array<CustomNodeType>;

  clear: () => void;
  add: (custom: CustomNodeType) => void;
  remove: (name: string) => void;
  validade: (custom: CustomNodeType) => void;

  sanitizeName: (name: string) => string;
  test: (custom: CustomNodeType) => void;
  build: (custom: CustomNodeType, test?: boolean) => typeof CVFComponent;
};

export const useCustomComponentStore = create<CustomComponentState>((set, get) => ({
  customComponents: [] as Array<CustomNodeType>,

  clear: () => {
    set({ customComponents: [] });
  },

  add: (custom: CustomNodeType): void => {
    custom.name = get().sanitizeName(custom.title);
    const nodeType = get().build(custom);
    const customComponents = get().customComponents;

    const idx = customComponents.findIndex((curr) => curr.title === custom.title);

    if (idx < 0) {
      customComponents.push(custom);
    } else {
      customComponents[idx] = custom;
    }

    useNodeStore.getState().addNodeType(nodeType);
    useNodeStore.getState().refreshNodesFromComponent(nodeType);

    set({ customComponents: [...customComponents] });
  },

  remove: (name: string): void => {
    const customComponents = get().customComponents;
    const idx = customComponents.findIndex((curr) => curr.name === name);
    if (idx > -1) {
      customComponents.splice(idx, 1);
    }

    set({ customComponents: [...customComponents] });

    useNodeStore.getState().removeNodeType(name);
  },

  sanitizeName: (name: string): string => {
    return (name || '').replace(/[\n| |\\|"|'|<|>]/g, '');
  },

  validade: ({ title: name, code }: CustomNodeType): void => {
    const hasName = !!(name || '').trim();
    const hasClass = code.search(/class[ ]*CustomComponent/g);

    if (!hasName) {
      throw new Error('Name required');
    }
    if (!hasClass) {
      throw new Error('CustomComponent class required');
    }

    get().test({ title: name, code });
  },

  test: (custom: CustomNodeType): void => {
    get().build(custom, true);
  },

  build: (custom: CustomNodeType, test = false): typeof CVFComponent => {
    // TODO: verificar forma de resolver imports conforme gerado pelo git.
    // @ts-ignore
    const PropertyTypeFork = PropertyType;
    // previne que o vite deixe de declare essas classes não utilizadas

    const codeSanitized = custom.code //
      .replace(/[ ]*import[^;]*;\n/g, '')
      .replace(/CVFComponent/g, CVFComponent.name)
      .replace(/CVFIOComponent/g, CVFIOComponent.name)
      .replace(/CVFNodeProcessor/g, CVFNodeProcessor.name)
      .replace(/PropertyType/g, 'PropertyTypeFork')
      .replace(/GCStore/g, GCStore.constructor.name);

    const createComponentClass = `(cv) => { ${codeSanitized}; return CustomComponent}`;

    if (test) {
      const createEvalRs = `(${createComponentClass})()`;
      const rs = eval(createEvalRs);

      return rs;
    } else {
      const createEvalRs = `({ func: ${createComponentClass} })`;

      const rs = eval(createEvalRs.replace(/CustomComponent/g, custom.name || ''));
      const classInstance = rs.func(cv);

      return classInstance;
    }
  },
}));
