import { PluginType } from '../../core/types/plugin';
import * as morphologySamples from './morphology-samples';
import * as thresholdSamples from './threshold-samples';

const OpenCVPlugin: PluginType = {
  name: 'IDE Plugin',
  components: [
    //Threshold Samples
    ...Object.values(thresholdSamples),
    //Morphology Samples
    ...Object.values(morphologySamples),
  ],
};

export default OpenCVPlugin;
