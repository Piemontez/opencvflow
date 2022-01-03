import { CVFComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';

const tabName = 'Inputs';

class VideoCaptureProcessor extends CVFNodeProcessor {
  name = 'cv_videocapture';
  constructor() {
    super();
    //cap = new cv::VideoCapture();
  }

  async start() {
    //cap->open(index);
  }

  async proccess() {
    /*
    _sources.clear();

    if(!cap->isOpened())
        return;

    cv::Mat frame;
    *cap >> frame;

    _sources.push_back(frame);
    */
  }

  async stop() {
    //if(cap->isOpened())
    //cap->release();
  }
}

export class CVVideoCaptureComponent extends CVFComponent {
  menu = { tabTitle: tabName, title: 'Sobel' };

  get title() {
    return 'Video Capture';
  }
  
  processor = VideoCaptureProcessor;
}
