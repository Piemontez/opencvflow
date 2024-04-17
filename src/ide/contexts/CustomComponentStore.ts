import { createContext } from 'react';
import { CustomNodeType } from '../../core/types/custom-node-type';
import { CVFComponent, CVFIOComponent } from '../types/component';
import { PropertyType } from '../types/property';
import { CVFNodeProcessor } from '../../core/types/node';
import GCStore from '../../core/contexts/GCStore';
import { useNodeStore } from '../../core/contexts/NodeStore';

interface CustomComponentStoreI {
  customComponents: Array<CustomNodeType>;
  add(custom: CustomNodeType): void;
  remove(name: string): void;
  validade(custom: CustomNodeType): void;
}

class CustomComponentStore implements CustomComponentStoreI {
  customComponents: Array<CustomNodeType> = [];

  add = (custom: CustomNodeType): void => {
    custom.name = this.sanitizeName(custom.title);
    const nodeType = this.build(custom);

    const idx = this.customComponents.findIndex((curr) => curr.title === custom.title);

    if (idx < 0) {
      this.customComponents = this.customComponents.concat([custom]);
    } else {
      this.customComponents[idx] = custom;
    }

    useNodeStore.getState().addNodeType(nodeType);
    useNodeStore.getState().refreshNodesFromComponent(nodeType);
  };

  remove = (name: string): void => {
    const idx = this.customComponents.findIndex((curr) => curr.name === name);
    if (idx > -1) {
      this.customComponents.splice(idx, 1);
    }

    useNodeStore.getState().removeNodeType(name);
  };

  sanitizeName = (name: string): string => {
    return (name || '').replaceAll(/[\n| |\\|"|'|<|>]/g, '');
  };

  validade = ({ title: name, code }: CustomNodeType): void => {
    const hasName = !!(name || '').trim();
    const hasClass = code.search(/class[ ]*CustomComponent/g);

    if (!hasName) {
      throw new Error('Name required');
    }
    if (!hasClass) {
      throw new Error('CustomComponent class required');
    }

    this.test({ title: name, code });
  };

  test = (custom: CustomNodeType): void => {
    this.build(custom, true);
  };

  build = (custom: CustomNodeType, test = false): typeof CVFComponent => {
    // @ts-ignore
    class CVFComponentFork extends CVFComponent {}
    // @ts-ignore
    class CVFIOComponentFork extends CVFIOComponent {}
    // @ts-ignore
    class CVFNodeProcessorFork extends CVFNodeProcessor {}
    // @ts-ignore
    const GCStoreFork = GCStore;
    // @ts-ignore
    const PropertyTypeFork = PropertyType;

    const codeSanitized = custom.code //
      .replaceAll(/[ ]*import[^;]*;\n/g, '')
      .replaceAll('CVFComponent', 'CVFComponentFork')
      .replaceAll('CVFIOComponent', 'CVFIOComponentFork')
      .replaceAll('CVFNodeProcessor', 'CVFNodeProcessorFork')
      .replaceAll('PropertyType', 'PropertyTypeFork')
      .replaceAll('GCStore', 'GCStoreFork');

    const createComponentClass = `() => { ${codeSanitized}; return CustomComponent}`;

    if (test) {
      const createEvalRs = `(${createComponentClass})()`;
      const rs = eval(createEvalRs);

      return rs;
    } else {
      const createEvalRs = `({ func: ${createComponentClass} })`;

      const rs = eval(createEvalRs.replaceAll('CustomComponent', custom.name || ''));
      const classInstance = rs.func();

      return classInstance;
    }
  };
}

const instance = new CustomComponentStore() as CustomComponentStoreI;
export default instance;
export const CustomComponentContext = createContext(instance);
