import { PluginType } from 'renderer/types/plugin';
import * as morphologySamples from './morphology-samples';

const OpenCVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Morphology Samples
    ...Object.values(morphologySamples),
  ],
};

export default OpenCVPlugin;
