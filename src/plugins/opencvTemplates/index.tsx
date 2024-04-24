import { PluginType } from '../../core/types/plugin';
import morphologySamples from './morphology-samples';
import thresholdSamples from './threshold-samples';

const OpenCVTemplatesPlugin: PluginType = {
  name: 'OpenCV Templates Plugin',
  components: [],
  templates: [
    //
    thresholdSamples,
    morphologySamples,
  ],
};

export default OpenCVTemplatesPlugin;
