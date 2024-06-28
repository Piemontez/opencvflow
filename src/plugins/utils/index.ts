import { PluginType } from '../../core/types/plugin';
import { HistogramCalcComponent } from './HistogramCalcComponent';
import { MapPropertiesComponent } from './MapPropertiesComponent';

const UtilsCVPlugin: PluginType = {
  name: 'Utils Plugin',
  components: [HistogramCalcComponent, MapPropertiesComponent],
};

export default UtilsCVPlugin;
