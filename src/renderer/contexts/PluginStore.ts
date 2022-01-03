import { observable, action, makeObservable } from 'mobx';
import * as glob from 'glob';
import { PluginFile, PluginType } from 'renderer/types/plugin';
import NodeStore from './NodeStore';

interface PluginStoreI {
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
  filesPaths: string[] = [];
  filesNames: string[] = [];

  constructor() {
    makeObservable(this);
  }

  @observable plugins = [] as PluginFile[];

  @action async init() {
    //TODO: Carregar via configuração
    this.filesPaths = [];

    this.filesNames = await this.searchFiles();
    const plugins = await this.loadFiles();
    for (const plugin of plugins) {
      await this.addPlugin(plugin);
    }
  }
  async searchFiles(): Promise<string[]> {
    //TODO: Adicionar logger
    console.log(`Searching for plugins.`);

    let allFiles: string[] = [];
    for (const file of this.filesPaths) {
      const files = glob.sync(file);
      allFiles = allFiles.concat(files);
    }

    //TODO: Adicionar logger
    console.log(`Plugins files found: ${allFiles.length}`);
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
      pluginFile = (await import(fileName)) as PluginFile;
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

  async addPlugin(pluginFile: PluginFile) {
    //Adiciona arquivo a lista de plugins carregados
    this.plugins.push(pluginFile);
    if (pluginFile.plugin) {
      const plugin: PluginType = pluginFile.plugin;
      plugin.components.forEach((_) => NodeStore.addNodeType(_));
    }
  }
}

export default new PluginStore() as PluginStoreI;
