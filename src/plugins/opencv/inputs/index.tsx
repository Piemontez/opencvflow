import { CVFOutputComponent } from 'renderer/types/component';
import { CVFNodeProcessor } from 'renderer/types/node';
import cv, { Mat } from 'opencv-ts';
import { PropertyType } from 'renderer/types/property';
import GCStore from 'renderer/contexts/GCStore';
import messages from '../messages';

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
        GCStore.add(src);

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

  static processor = class FileLoaderProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'file', type: PropertyType.FileUrl },
      { name: 'loop', type: PropertyType.Boolean },
    ];

    file?: File;
    loop: boolean = false;

    isImg: boolean = false;
    isVideo: boolean = false;
    video: HTMLVideoElement | null = null;
    img: HTMLImageElement | null = null;

    cap?: VideoCapture;

    constructor() {
      super();
      this.body = this.body.bind(this);
      this.start = this.start.bind(this);
      this.proccess = this.proccess.bind(this);
    }

    body() {
      return (
        <div style={{ padding: 0, margin: 0, minHeight: 240, minWidth: 320 }}>
          <img
            width="320"
            height="240"
            alt=""
            style={this.isImg ? {} : { display: 'none' }}
            ref={(ref) => (this.img = ref)}
          />
          <video
            autoPlay
            width="320"
            height="240"
            muted
            playsInline
            style={this.isVideo ? {} : { display: 'none' }}
            ref={(ref) => (this.video = ref)}
          />
        </div>
      );
    }

    async start() {
      const url = this.file ? URL.createObjectURL(this.file) : null;

      this.isImg = false;
      this.isVideo = false;
      this.video!.src = '';
      this.img!.src = '';
      if (url) {
        if (this.file!.type.match('image.*')) {
          this.isImg = true;
          this.img!.src = url;
        } else if (this.file!.type.match('video.*')) {
          this.isVideo = true;
          this.video!.src = url;
          this.video!.loop = this.loop;
          await this.video!.play();

          this.cap = new cv.VideoCapture(this.video!);
        } else {
          throw new Error(messages.INVALID_IMAGE_OR_VIDEO_FILE);
        }
      } else {
        throw new Error(messages.IMG_VID_FILE_REQUIRED);
      }
    }

    async proccess() {
      if (this.isImg) {
        const src = cv.imread(this.img!);
        GCStore.add(src);

        this.sources = [src];
      }
      if (this.isVideo && this.cap && this.video!.width && this.video!.width) {
        const src = new cv.Mat(
          this.video!.height!,
          this.video!.width!,
          cv.CV_8UC4
        );
        GCStore.add(src);

        this.cap.read(src);

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

export class CVKernelComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Kernel' };

  static processor = class KernelProcessor extends CVFNodeProcessor {
    static properties = [{ name: 'kernel', type: PropertyType.DoubleMatrix }];

    kernel: Mat = new cv.Mat(3, 3, cv.CV_16S, new cv.Scalar(0));

    async proccess() {
      this.sources = [this.kernel];

      const out = new cv.Mat();
      const dsize = new cv.Size(
        Math.max(150, this.kernel.cols),
        Math.max(150, this.kernel.rows)
      );
      cv.resize(this.kernel, out, dsize, 0, 0, cv.INTER_AREA);

      GCStore.add(out);

      this.output(out);
    }
  };
}

export class CVGaussianKernelComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'GausKernel' };

  static processor = class GaussianKernelProcessor extends CVFNodeProcessor {
    static properties = [
      { name: 'sigma', type: PropertyType.Decimal },
      { name: 'rows', type: PropertyType.Integer },
      { name: 'cols', type: PropertyType.Integer },
    ];

    sigma: number = 1;
    rows: number = 5;
    cols: number = 5;
    kernel?: Mat;

    buildKernel() {
      this.kernel = new cv.Mat(
        this.rows,
        this.cols,
        cv.CV_32F,
        new cv.Scalar(0)
      );

      cv.multiply(
        cv.getGaussianKernel(this.rows, this.sigma, cv.CV_32F),
        cv.getGaussianKernel(this.cols, this.sigma, cv.CV_32F).t(),
        this.kernel,
        1
      );
    }

    async proccess() {
      if (
        !this.kernel ||
        this.kernel.rows !== this.rows ||
        this.kernel.cols !== this.cols
      ) {
        this.buildKernel();
      }

      this.output(this.kernel!);

      this.sources = [this.kernel!];
    }
  };
}
