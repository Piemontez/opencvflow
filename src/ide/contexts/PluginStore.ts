import { MenuActionProps } from '../types/menu';
import { PluginFile, PluginType } from '../types/plugin';
import { CVFComponent } from '../types/component';
import { useMenuStore } from './MenuStore';
import * as localPlugins from '../../plugins';
import { create } from 'zustand';
import { useNodeStore } from '../../core/contexts/NodeStore';

type PluginState = {
  loading: boolean;
  loaded: boolean;
  plugins: PluginFile[];

  init: () => Promise<void>;
  addPlugin: (pluginFile: PluginFile) => Promise<void>;
};

export const usePluginStore = create<PluginState>((set, get) => ({
  loading: false,
  loaded: false,
  plugins: [] as PluginFile[],

  init: async () => {
    if (get().loading) {
      throw new Error('Loading');
    }
    get().loading = true;

    const localPluginsValues = Object.values(localPlugins);
    console.log(`IDE plugins found: ${localPluginsValues.length}`);

    // Limpa a lista carregada anteriormente
    if (get().loaded) {
      get().plugins = [];
    }

    //Carrega os plugins instalados no sistema
    for (const plugin of localPluginsValues) {
      await get().addPlugin({ fileName: plugin.name, plugin: plugin });
    }

    set({
      //
      loading: false,
      loaded: true,
    });
  },

  addPlugin: async (pluginFile: PluginFile) => {
    //Adiciona a lista de plugins carregados
    get().plugins.push(pluginFile);

    if (pluginFile.plugin) {
      const plugin: PluginType = pluginFile.plugin;
      console.log(`Add components from: ${plugin.name}`);

      for (const comp of plugin.components) {
        if ((comp as MenuActionProps).tabTitle) {
          const compAs = comp as MenuActionProps;
          console.log(`Add action: ${compAs.title}`);
          useMenuStore.getState().addMenuAction(compAs);
        } else {
          const compAs = comp as typeof CVFComponent;
          console.log(`Add component: ${compAs.name}`);
          if (compAs.menu) {
            useMenuStore.getState().addComponentMenuAction(compAs);
          }
          useNodeStore.getState().addNodeType(compAs);
        }
      }
    }
  },
}));