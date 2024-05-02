import { CVFComponent } from '../../ide/components/NodeComponent';
import { MenuActionProps } from '../../ide/types/menu';
import { ProjectTemplate } from './project-template';

/**
 * Plugin Type
 * Informações carregas dinâmicamente pelo sistema
 */
export type PluginType = {
  name: string;
  components: Array<typeof CVFComponent | MenuActionProps>;
  templates?: Array<ProjectTemplate>;
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
