import { CVFOutputComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';

const tabName = 'Inputs';
class VideoCapture extends cv.VideoCapture {}

class VideoCaptureProcessor extends CVFNodeProcessor {
  video: HTMLVideoElement | null = null;
  cap?: VideoCapture;

  constructor() {
    super();
    this.body = this.body.bind(this);
    this.start = this.start.bind(this);
    this.proccess = this.proccess.bind(this);
  }

  body() {
    return (
      <video
        autoPlay
        muted={true}
        playsInline
        ref={(ref) => (this.video = ref)}
      />
    );
  }

  async start() {
    this.cap = new cv.VideoCapture(this.video!);

    await navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediaStream) => {
        this.video!.srcObject = mediaStream;
        this.video!.onloadedmetadata = () => {
          setTimeout(() => this.proccess(), 1000);
          this.video!.width = this.video!.videoWidth;
          this.video!.height = this.video!.videoHeight;
          this.video!.play();
        };
      });
  }

  async proccess() {
    if (this.video!.width && this.video!.width) {
      const src = new cv.Mat(this.video!.height!, this.video!.width!, cv.CV_8UC4);

      this.cap!.read(src);

      this.sources = [src];
    }
  }

  async stop() {
    delete this.cap;
    this.cap = undefined;
  }
}

export class CVVideoCaptureComponent extends CVFOutputComponent {
  get title() {
    return 'Video Capture';
  }
  static menu = { tabTitle: tabName, title: 'Video Capture' };
  static processor = VideoCaptureProcessor;
}
