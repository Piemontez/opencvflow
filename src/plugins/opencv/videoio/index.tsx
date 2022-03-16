import { CVFOutputComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';

const tabName = 'Inputs';
class VideoCapture extends cv.VideoCapture {}

/**
 * Video Capture component and node
 */
export class CVVideoCaptureComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Video Capture' };

  static processor = class VideoCaptureProcessor extends CVFNodeProcessor {
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
          width="320"
          height="240"
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
          if (this.video) {
            this.video.srcObject = mediaStream;
            this.video.onloadedmetadata = () => {
              //this.video!.width = this.video!.videoWidth;
              //this.video!.height = this.video!.videoHeight;
              this.video!.play();
            };
          }
          return null;
        });
    }

    async proccess() {
      if (this.video!.width && this.video!.width) {
        const src = new cv.Mat(
          this.video!.height!,
          this.video!.width!,
          cv.CV_8UC4
        );

        this.cap!.read(src);

        this.sources = [src];
      }
    }

    async stop() {
      this.video!.pause();

      delete this.cap;
      this.cap = undefined;
    }
  };
}

/**
 * File Loader component and node
 */
export class CVFileLoaderCaptureComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'File Loader' };

  static processor = class VideoCaptureProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'filename', type: PropertyType.FileUrl },
      { name: 'loop', type: PropertyType.Boolean },
    ];
    filename: string = '';
    loop: boolean = false;

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
          width="320"
          height="240"
          muted={true}
          playsInline
          ref={(ref) => (this.video = ref)}
        />
      );
    }

    async start() {
      this.video!.src = this.filename;
      this.video!.loop = this.loop;
      this.video!.play();

      this.cap = new cv.VideoCapture(this.video!);
    }

    async proccess() {
      if (this.video!.width && this.video!.width) {
        const src = new cv.Mat(
          this.video!.height!,
          this.video!.width!,
          cv.CV_8UC4
        );

        this.cap!.read(src);

        this.sources = [src];
      }
    }

    async stop() {
      this.video!.pause();

      delete this.cap;
      this.cap = undefined;
    }
  };
}
