import { PluginType } from 'renderer/types/plugin';
import {
  CVPlusComponent,
  CVSubComponent,
  CVMultiplyComponent,
  CVDivisionComponent,
  CVMulComponent,
  CVKernelComponent,
  CVGaussianKernelComponent,
} from './arithmetic';
import { CVSobelComponent } from './imgproc';
import { CVVideoCaptureComponent } from './videoio';

const OpenCVPlugin: PluginType = {
  name: "OpenCV Plugin",
  components: [
    //video
    CVVideoCaptureComponent,
    //arithmetic
    CVPlusComponent,
    CVSubComponent,
    CVMultiplyComponent,
    CVDivisionComponent,
    CVMulComponent,
    CVKernelComponent,
    CVGaussianKernelComponent,
    //imgproc
    CVSobelComponent,
  ],
};

export default OpenCVPlugin;
