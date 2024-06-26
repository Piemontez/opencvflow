import { MenuActionProps } from '../../ide/types/menu';
import { PluginFile, PluginType } from '../types/plugin';
import { CVFComponent } from '../../ide/components/NodeComponent';
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
  addPlugin: (pluginFile: PluginFile) => void;
};

export const usePluginStore = create<PluginState>((set, get) => ({
  loading: false,
  loaded: false,
  plugins: [] as PluginFile[],

  init: async () => {
    if (get().loaded) {
      throw new Error('Loaded');
    }

    if (get().loading) {
      throw new Error('Loading');
    }
    get().loading = true;

    const localPluginsValues = Object.values(plugins);
    console.info(`IDE plugins found: ${localPluginsValues.length}`);

    //Carrega os plugins instalados no sistema
    for (const plugin of localPluginsValues) {
      get().addPlugin({ fileName: plugin.name, plugin: plugin });
    }

    set({
      //
      loading: false,
      loaded: true,
    });
  },

  addPlugin: (pluginFile: PluginFile) => {
    //Adiciona a lista de plugins carregados
    get().plugins.push(pluginFile);

    if (pluginFile.plugin) {
      const plugin: PluginType = pluginFile.plugin;
      console.info(`Load from: ${plugin.name}`);

      // Adiciona os componentes e ações da tela
      for (const comp of plugin.components) {
        if ((comp as MenuActionProps).tabTitle) {
          const compAs = comp as MenuActionProps;
          console.info(`Add action: ${compAs.name || compAs.title}`);
          useMenuStore.getState().addMenuAction(compAs);
        } else {
          const compAs = comp as typeof CVFComponent;
          console.info(`Add component: ${compAs.name}`);
          if (compAs.menu) {
            useMenuStore.getState().addComponentMenuAction(compAs);
          }
          useNodeStore.getState().addNodeType(compAs);
        }
      }

      // Adiciona os templates de exemplo
      if (plugin.templates)
        for (const sampleTemplate of plugin.templates) {
          console.info(`Add template: ${sampleTemplate.title}`);
          useNewModalStore.getState().addTemplate(sampleTemplate);
        }
    }
  },
}));
