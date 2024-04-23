import { CVFComponent } from '../../ide/types/component';
import { MenuActionProps } from '../../ide/types/menu';
import { SampleTemplate } from './sample-template';

/**
 * Plugin Type
 * Informações carregas dinâmicamente pelo sistema
 */
export type PluginType = {
  name: string;
  components: Array<typeof CVFComponent | MenuActionProps>;
  sampleTemplates?: Array<SampleTemplate>;
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
