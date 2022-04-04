import { PluginType } from 'renderer/types/plugin';
import * as files from './files/index-factory';
import * as build from './build';

const OpenCVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Files
    ...Object.values(files),
    //Build
    ...Object.values(build),
  ],
};

export default OpenCVPlugin;
