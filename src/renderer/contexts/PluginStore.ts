import { MenuAction } from 'renderer/types/menu';
import { createContext } from 'react';
import { observable, action, makeObservable } from 'mobx';
import * as glob from 'glob';
import { PluginFile, PluginType } from 'renderer/types/plugin';
import NodeStore from './NodeStore';
import MenuStore from './MenuStore';
import * as localPlugins from 'plugins';
import { CVFComponent } from 'renderer/types/component';

interface PluginStoreI {
  //True ao finalizar a tarefa de carregas os plugins
  loaded:boolean;
  //Inicializa e carrega os plugins ao iniciar a aplicação
  init(): Promise<void>;
  //Procura os plugins instalados nas pastas de plugins
  searchFiles(): Promise<string[]>;
  //Carrega todos os plugins
  loadFiles(): Promise<PluginFile[]>;
  //Carrega o plugin pelo nome do arquivos
  loadFile(fileName: string): Promise<PluginFile>;
  //Adiciona o plugin aos componentes da IDE
  addPlugin(pluginFile: PluginFile): Promise<void>;
}

class PluginStore {
  filesPaths: string[] = ['../plugins'];
  filesNames: string[] = [];

  @observable loaded = false;
  @observable plugins = [] as PluginFile[];

  constructor() {
    makeObservable(this);
  }

  @action async init() {
    //Carrega os plugins instalados no sistema
    const localPluginsValues = Object.values(localPlugins);
    console.log(`IDE plugins found: ${localPluginsValues.length}`);
    for (const plugin of localPluginsValues) {
      await this.addPlugin({ fileName: plugin.name, plugin: plugin });
    }

    //Carrega os plugins instaladas na pasta plugins
    this.filesNames = await this.searchFiles();
    const plugins = await this.loadFiles();
    for (const plugin of plugins) {
      await this.addPlugin(plugin);
    }
    this.loaded = true;
  }

  async searchFiles(): Promise<string[]> {
    //TODO: Adicionar logger
    console.log(`Searching for externals plugins.`);

    let allFiles: string[] = [];
    for (const file of this.filesPaths) {
      const files = glob.sync(file);
      allFiles = allFiles.concat(files);
    }

    //TODO: Adicionar logger
    console.log(`Externals plugins files found: ${allFiles.length}`);
    return allFiles;
  }

  async loadFiles(): Promise<PluginFile[]> {
    console.log(`Loading plugins.`);

    const allFiles: PluginFile[] = [];
    //for (const fileName of this.filesNames) {
    //  const config = await this.loadFile(fileName);
    //  allFiles.push(config);
    //}

    console.log(`Plugins loaded: ${allFiles.length}`);
    return allFiles;
  }

  async loadFile(fileName: string): Promise<PluginFile> {
    let pluginFile: PluginFile;

    try {
      console.log(`Loading: ${fileName.replace(/^.*plugins/, 'plugins')}`);

      //Importa o plugin
      pluginFile = (await eval(`import(${fileName})`)) as PluginFile;
      pluginFile.fileName = fileName;

      const df = pluginFile.plugin;
      if (df) {
        console.log(`Plugin loaded: ${df.name}`);
        pluginFile.plugin = df;
      } else {
        pluginFile.error = 'Plugin with out exports.plugin';
        console.warn(pluginFile.error);
      }
    } catch (err: any) {
      console.error(err.message, err);
      pluginFile = {
        fileName: fileName,
        error: err.message,
      };
    }
    return pluginFile;
  }

  @action async addPlugin(pluginFile: PluginFile) {
    //Adiciona arquivo a lista de plugins carregados
    this.plugins.push(pluginFile);
    if (pluginFile.plugin) {
      const plugin: PluginType = pluginFile.plugin;

      console.log(`Add components from: ${plugin.name}`);
      for (const comp of plugin.components) {
        if ((comp as MenuAction).tabTitle) {
          const compAs = comp as MenuAction;
          console.log(`Add action: ${compAs.title}`);
          MenuStore.addMenuAction(compAs);
        } else {
          const compAs = comp as typeof CVFComponent;
          console.log(`Add component: ${compAs.name}`);
          if (compAs.menu) {
            MenuStore.addComponentMenuAction(compAs);
          }
          NodeStore.addNodeType(compAs);
        }
      }
    }
  }
}

const instance = new PluginStore() as PluginStoreI;
export default instance;
export const PluginStoreContext = createContext(instance);
