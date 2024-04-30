import { PluginType } from '../../core/types/plugin';
import { NewComponentAction } from './NewComponentAction';

const OpenCVPlugin: PluginType = {
  name: 'Custom Plugin',
  components: [NewComponentAction],
};

export default OpenCVPlugin;
