import { PluginType } from 'renderer/types/plugin';
import * as arithmetic from './arithmetic';
import * as imgproc from './imgproc';
import * as conversors from './conversors';
import * as videoio from './videoio';
import * as segmentation from './segmentation';
import * as edge from './edge';
import * as morphology from './morphology';
import * as smoothing from './smoothing';

const OpenCVPlugin: PluginType = {
  name: "OpenCV Plugin",
  components: [
    // video
    ...Object.values(videoio),
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
  ],
};

export default OpenCVPlugin;
