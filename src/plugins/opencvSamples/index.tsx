import { PluginType } from '../../core/types/plugin';
import morphologySamples from './morphology-samples';
import thresholdSamples from './threshold-samples';

const OpenCVPlugin: PluginType = {
  name: 'OpenCV Samples Plugin',
  components: [],
  sampleTemplates: [
    //
    thresholdSamples,
    morphologySamples,
  ],
};

export default OpenCVPlugin;
