import { PluginType } from 'renderer/types/plugin';
import {
  CVPlusComponent,
  CVSubComponent,
  CVMultiplyComponent,
  CVDivComponent,
  CVMulComponent,
  CVKernelComponent,
} from './arithmetic';
import { CVSobelComponent } from './imgproc';
import { CVVideoCaptureComponent } from './videoio';

const OpenCVPlugin: PluginType = {
  name: "OpenCV Plugin",
  components: [
    //arithmetic
    CVPlusComponent,
    CVSubComponent,
    CVMultiplyComponent,
    CVDivComponent,
    CVMulComponent,
    CVKernelComponent,
    //video
    CVVideoCaptureComponent,
    //imgproc
    CVSobelComponent,
  ],
};

export default OpenCVPlugin;
