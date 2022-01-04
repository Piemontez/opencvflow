import { CVFOutputComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';

const tabName = 'Inputs';
class VideoCapture extends cv.VideoCapture {}

class VideoCaptureProcessor extends CVFNodeProcessor {
  video: HTMLVideoElement | null = null;
  canvas: HTMLCanvasElement | null = null;
  cap?: VideoCapture;

  constructor() {
    super();
    this.body = this.body.bind(this);
    this.start = this.start.bind(this);
    this.proccess = this.proccess.bind(this);
  }

  body() {
    setTimeout(() => this.start(), 1000);
    return (
      <>
        <video
          autoPlay
          muted={true}
          playsInline
          ref={(ref) => (this.video = ref)}
        />
        <canvas
          id="canvasOutput"
          width="320"
          height="240"
          ref={(ref) => (this.canvas = ref)}
        />
      </>
    );
  }

  async start() {
    this.cap = new cv.VideoCapture(this.video!);

    navigator.mediaDevices
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
    let src = new cv.Mat(this.video!.height!, this.video!.width!, cv.CV_8UC4);
    
    this.cap!.read(src);

    this.sources = [src];

    cv.imshow(this.canvas!, src);
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
