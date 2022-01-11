import { CVFComponent } from './component';
import { MenuActionProps } from './menu';

/**
 * Plugin Type
 * Informações carregas dinâmicamente pelo sistema
 */
export type PluginType = {
  name: string;
  components: Array<typeof CVFComponent | MenuActionProps>;
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
