import { PluginType } from 'renderer/types/plugin';
import * as arithmetic from './arithmetic';
import * as imgproc from './imgproc';
import * as conversors from './conversors';
import * as inputs from './inputs';
import * as segmentation from './segmentation';
import * as edge from './edge';
import * as morphology from './morphology';
import * as smoothing from './smoothing';
import * as draw from './draw';
import * as utils from './utils';

const OpenCVPlugin: PluginType = {
  name: "OpenCV Plugin",
  components: [
    // video
    ...Object.values(inputs),
    // conversors
    ...Object.values(conversors),
    // arithmetic
    ...Object.values(arithmetic),
    // smoothing
    ...Object.values(smoothing),
    // segmentation
    ...Object.values(segmentation),
    // morphology
    ...Object.values(morphology),
    // edge
    ...Object.values(edge),
    // imgproc
    ...Object.values(imgproc),
    // draw
    ...Object.values(draw),
    // utils
    ...Object.values(utils),
  ],
};

export default OpenCVPlugin;
