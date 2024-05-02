import { PluginType } from '../../core/types/plugin';
import * as files from './files';

const IDECVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Files
    ...Object.values(files),
  ],
};

export default IDECVPlugin;
