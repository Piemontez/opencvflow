import { PluginType } from '../../ide/types/plugin';
import * as files from './files';

const OpenCVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Files
    ...Object.values(files),
  ],
};

export default OpenCVPlugin;
