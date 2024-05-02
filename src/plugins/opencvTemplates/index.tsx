import { PluginType } from '../../core/types/plugin';
import ThresholdSamplesAction from './threshold-samples';
import MorphologySamplesAction from './morphology-samples';
import HistogramCalcSamplesAction from './histogram-cal';

const OpenCVTemplatesPlugin: PluginType = {
  name: 'OpenCV Templates Plugin',
  components: [],
  templates: [
    //
    ThresholdSamplesAction,
    MorphologySamplesAction,
    HistogramCalcSamplesAction,
  ],
};

export default OpenCVTemplatesPlugin;
