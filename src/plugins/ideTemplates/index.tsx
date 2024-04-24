import { PluginType } from '../../core/types/plugin';
import emptyProject from './empty-project';
import openFileProject from './open-project';

const IDETemplatesPlugin: PluginType = {
  name: 'IDE Templates Plugin',
  components: [],
  templates: [
    //
    emptyProject,
    openFileProject,
  ],
};

export default IDETemplatesPlugin;
