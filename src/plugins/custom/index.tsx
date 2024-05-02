import { PluginType } from '../../core/types/plugin';
import { NewComponentAction } from './NewComponentAction';

const CustomCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction],
};

export default CustomCVPlugin;
