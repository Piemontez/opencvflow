import { PluginType } from '../../core/types/plugin';
import ThresholdSamplesAction from './threshold-samples';
import MorphologySamplesAction from './morphology-samples';
import HistogramCalcSamplesAction from './histogram-cal';
import EdgeSamplesAction from './edge';
import ColorsFiltersSamplesAction from './colors-filter';

const OpenCVTemplatesPlugin: PluginType = {
  name: 'OpenCV Templates Plugin',
  components: [],
  templates: [
    //
    EdgeSamplesAction,
    ThresholdSamplesAction,
    MorphologySamplesAction,
    HistogramCalcSamplesAction,
    ColorsFiltersSamplesAction,
  ],
};

export default OpenCVTemplatesPlugin;
