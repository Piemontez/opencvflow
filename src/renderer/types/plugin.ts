import { CVFComponent } from './component';

/**
 * Plugin Type
 * Informações carregas dinâmicamente pelo sistema
 */
export type PluginType = {
  name: string;
  components: typeof CVFComponent[];
};

/**
 * Plugin File
 * Arquivos de plugins carregados,
 * utilizado internamente pelo sistema
 */
export interface PluginFile {
  fileName: string;
  error?: string;
  plugin?: PluginType;
}