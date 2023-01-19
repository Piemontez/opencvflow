import { observable, action, makeObservable } from 'mobx';
import { createContext } from 'react';
import { CustomComponent } from 'renderer/types/custom-component';
import { CVFComponent, CVFIOComponent } from 'renderer/types/component';
import { PropertyType } from 'renderer/types/property';
import { CVFNodeProcessor } from 'renderer/types/node';
import GCStore from 'renderer/contexts/GCStore';
import NodeStore from './NodeStore';

interface CustomComponentStoreI {
  customComponents: Array<CustomComponent>;
  add(custom: CustomComponent): void;
  remove(name: string): void;
  validade(custom: CustomComponent): void;
}

class CustomComponentStore implements CustomComponentStoreI {
  @observable customComponents: Array<CustomComponent> = [];

  constructor() {
    makeObservable(this);
    /* reaction(
      () => this.elements,
      (_) => console.log(this.elements.length)
    ); */
  }

  @action add = (custom: CustomComponent): void => {
    custom.name = this.sanitizeName(custom.title);
    const nodeType = this.build(custom);

    const idx = this.customComponents.findIndex(
      (curr) => curr.title === custom.title
    );

    if (idx < 0) {
      this.customComponents = this.customComponents.concat([custom]);
    } else {
      this.customComponents[idx] = custom;
    }

    NodeStore.addNodeType(nodeType, { repaint: idx < 0 });
    NodeStore.refreshNodesFromComponent(nodeType);
  };

  @action remove = (name: string): void => {
    const idx = this.customComponents.findIndex((curr) => curr.name === name);
    if (idx > -1) {
      this.customComponents.splice(idx, 1);
    }

    NodeStore.removeNodeType(name);
  };

  sanitizeName = (name: string): string => {
    return (name || '').replaceAll(/[\n| |\\|"|'|<|>]/g, '');
  };

  validade = ({ title: name, code }: CustomComponent): void => {
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

  test = (custom: CustomComponent): void => {
    this.build(custom, true);
  };

  build = (custom: CustomComponent, test = false): typeof CVFComponent => {
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

      const rs = eval(
        createEvalRs.replaceAll('CustomComponent', custom.name || '')
      );
      const classInstance = rs.func();

      return classInstance;
    }
  };
}

const instance = new CustomComponentStore() as CustomComponentStoreI;
export default instance;
export const CustomComponentContext = createContext(instance);
