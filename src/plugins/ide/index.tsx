import { PluginType } from 'renderer/types/plugin';
import * as files from './files/index-factory';

const OpenCVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Files
    ...Object.values(files),
  ],
};

export default OpenCVPlugin;
