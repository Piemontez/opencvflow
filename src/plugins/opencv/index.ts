import { PluginType } from 'renderer/types/plugin';
import * as arithmetic from './arithmetic';
import * as imgproc from './imgproc';
import * as videoio from './videoio';

const OpenCVPlugin: PluginType = {
  name: "OpenCV Plugin",
  components: [
    //video
    ...Object.values(videoio),
    //imgproc
    ...Object.values(arithmetic),
    //arithmetic
    ...Object.values(imgproc),
  ],
};

export default OpenCVPlugin;
