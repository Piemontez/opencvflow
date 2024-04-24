import { MenuActionProps } from '../../ide/types/menu';
import { PluginFile, PluginType } from '../types/plugin';
import { CVFComponent } from '../../ide/types/component';
import { useMenuStore } from '../../ide/contexts/MenuStore';
import { plugins } from '../../plugins';
import { create } from 'zustand';
import { useNodeStore } from './NodeStore';
import { useNewModalStore } from '../../ide/contexts/NewModalStore';

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

    const localPluginsValues = Object.values(plugins);
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
      console.log(`Load from: ${plugin.name}`);

      // Adiciona os componentes e ações da tela
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

      // Adiciona os templates de exemplo
      if (plugin.templates)
        for (const sampleTemplate of plugin.templates) {
          console.log(`Add template: ${sampleTemplate.title}`);
          useNewModalStore.getState().addTemplate(sampleTemplate);
        }
    }
  },
}));
