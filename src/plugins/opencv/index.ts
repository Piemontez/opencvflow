import { PluginType } from '../../core/types/plugin';
import * as arithmetic from './arithmetic';
import * as others from './others';
import * as conversors from './conversors';
import * as inputs from './inputs';
import * as segmentation from './segmentation';
import * as edge from './edge';
import * as morphology from './morphology';
import * as smoothing from './smoothing';
import * as transform from './transform';
import * as draw from './draw';
import * as utils from './utils';
import * as geometricTransformations from './geometricTransformations';

const OpenCVPlugin: PluginType = {
  name: 'OpenCV Plugin',
  components: [
    // video
    ...Object.values(inputs),
    // geometric transformations
    ...Object.values(geometricTransformations),
    // conversors
    ...Object.values(conversors),
    // arithmetic
    ...Object.values(arithmetic),
    // smoothing
    ...Object.values(smoothing),
    // morphology
    ...Object.values(morphology),
    // edge
    ...Object.values(edge),
    // segmentation
    ...Object.values(segmentation),
    // transform
    ...Object.values(transform),
    // others
    ...Object.values(others),
    // draw
    ...Object.values(draw),
    // utils
    ...Object.values(utils),
  ],
};

export default OpenCVPlugin;
