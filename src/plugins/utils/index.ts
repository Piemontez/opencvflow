import { PluginType } from '../../core/types/plugin';
import { HistogramCalcComponent } from './HistogramCalcComponent';

const UtilsCVPlugin: PluginType = {
  name: 'Utils Plugin',
  components: [HistogramCalcComponent],
};

export default UtilsCVPlugin;
