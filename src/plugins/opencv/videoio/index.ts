import { CVFOutputComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import { VideoCapture } from 'opencv4nodejs';

const tabName = 'Inputs';

class VideoCaptureProcessor extends CVFNodeProcessor {
  cap?: VideoCapture;

  async start() {
    this.cap = new VideoCapture(0);
  }

  async proccess() {
    this.sources = [this.cap!.read()];
  }

  async stop() {
    delete this.cap;
    this.cap = undefined;
  }
}

export class CVVideoCaptureComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Video Capture' };
  static processor = VideoCaptureProcessor;

  get title() {
    return 'Video Capture';
  }
}
