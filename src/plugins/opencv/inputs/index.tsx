import { CVFOutputComponent } from '../../../ide/types/component';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv, { Mat } from 'opencv-ts';
import { MorphShapes } from 'opencv-ts/src/ImageProcessing/ImageFiltering';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { Position } from 'reactflow';
import { SourceHandle } from '../../../core/types/handle';
import { NodeSizes, VideoSizes } from '../../../core/config/sizes';
import { DataTypes } from 'opencv-ts/src/core/HalInterface';
import messages from '../messages';

const tabName = 'Inputs';
class VideoCapture extends cv.VideoCapture {}

/**
 * Video Capture component and node
 */
export class CVVideoCaptureComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Video Capture' };

  sources: SourceHandle[] = [
    { title: 'out', position: Position.Right },
    { title: 'rows', position: Position.Right },
    { title: 'cols', position: Position.Right },
    { title: 'type', position: Position.Right },
    { title: 'channels', position: Position.Right },
  ];

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
          width={VideoSizes.minWidth}
          height={VideoSizes.minHeight}
          muted
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
              this.video!.width = this.video!.videoWidth;
              this.video!.height = this.video!.videoHeight;
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

        this.sources = [src, src.rows, src.cols, src.type(), src.channels()];
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

  sources: SourceHandle[] = [
    { title: 'out', position: Position.Right },
    { title: 'rows', position: Position.Right },
    { title: 'cols', position: Position.Right },
    { title: 'type', position: Position.Right },
    { title: 'channels', position: Position.Right },
  ];

  static processor = class FileLoaderProcessor extends CVFNodeProcessor {
    properties = [
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

    header() {
      return (
        <>
          <img
            style={{ display: 'none' }}
            ref={(ref) => (this.img = ref)}
            alt=""
          />
          <video
            autoPlay
            muted
            playsInline
            style={{ display: 'none' }}
            ref={(ref) => (this.video = ref)}
          />
        </>
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

        this.output(src);
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

        this.sources = [src, src.rows, src.cols, src.type(), src.channels()];
      }
    }

    async stop() {
      this.video!.pause();

      delete this.cap;
      this.cap = undefined;
    }
  };
}

export class CVMatComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Mat' };

  static processor = class MatProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'dataType', type: PropertyType.DataTypes },
      { name: 'kernel', type: PropertyType.IntMatrix },
    ];

    dataType: DataTypes = cv.CV_8U;
    kernel: Mat = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));
    out: Mat = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));

    async start() {
      this.makeOutput();
    }

    async propertyChange(name: string, value: any): Promise<void> {
      if (name === 'dataType') {
        this.changeDataType(value as number);
      } else if (name === 'kernel') {
        this.makeOutput();
      }
    }

    changeDataType(value: number) {
      GCStore.add(this.kernel, -100);

      const newKernel = new cv.Mat(3, 3, this.dataType, new cv.Scalar(0));

      this.kernel.convertTo(newKernel, value);
      this.kernel = newKernel;

      const isUType = [cv.CV_8UC1, cv.CV_8UC2, cv.CV_8UC3, cv.CV_8UC4].includes(
        value
      );

      if (isUType) {
        this.properties[1].type = PropertyType.IntMatrix;
      } else {
        this.properties[1].type = PropertyType.DoubleMatrix;
      }
    }

    makeOutput() {
      GCStore.add(this.out, -100);

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const cols = this.kernel.cols * scale;
      const rows = this.kernel.rows * scale;

      this.out = new cv.Mat(rows, cols, this.kernel.type());
      const dsize = new cv.Size(cols, rows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_AREA);

      const isUType = [cv.CV_8UC1, cv.CV_8UC2, cv.CV_8UC3, cv.CV_8UC4].includes(
        this.kernel.type() as number
      );

      if (isUType) {
        const channels = this.out.channels();
        for (let j = 0; j < cols; j++) {
          for (let k = 0; k < rows; k++) {
            for (let i = 0; i < channels; i++) {
              this.out.charPtr(k, j)[i] = this.out.charPtr(k, j)[i] ? 255 : 0;
            }
          }
        }
      }
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}

export class CVKernelComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'Kernel' };

  static processor = class KernelProcessor extends CVFNodeProcessor {
    properties = [{ name: 'kernel', type: PropertyType.OneZeroMatrix }];

    kernel: Mat = new cv.Mat(3, 3, cv.CV_8U, new cv.Scalar(0));
    out: Mat = new cv.Mat(3, 3, cv.CV_8U, new cv.Scalar(0));

    async start() {
      this.makeOutput();
    }

    async propertyChange(name: string, _value: any): Promise<void> {
      if (name === 'kernel') {
        this.makeOutput();
      }
    }

    makeOutput() {
      GCStore.add(this.out, -100);

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const cols = this.kernel.cols * scale;
      const rows = this.kernel.rows * scale;

      this.out = new cv.Mat(rows, cols, this.kernel.type());
      const dsize = new cv.Size(cols, rows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_AREA);

      const channels = this.out.channels();
      for (let j = 0; j < cols; j++) {
        for (let k = 0; k < rows; k++) {
          for (let i = 0; i < channels; i++) {
            this.out.charPtr(k, j)[i] = this.out.charPtr(k, j)[i] ? 255 : 0;
          }
        }
      }
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}

export class CVStructuringElementComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'StructuringElement' };

  static processor = class StructuringElementProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'type', type: PropertyType.Integer },
      { name: 'rows', type: PropertyType.Integer },
      { name: 'cols', type: PropertyType.Integer },
    ];

    type: MorphShapes = cv.MORPH_RECT;
    rows: number = 15;
    cols: number = 15;
    kernel: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    out: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);

    async start() {
      this.buildKernel(this.rows, this.cols, this.type);
    }

    async propertyChange(name: string, value: any): Promise<void> {
      this.buildKernel(
        name === 'rows' ? (value as number) : this.rows,
        name === 'cols' ? (value as number) : this.cols,
        name === 'type' ? (value as MorphShapes) : this.type
      );
    }

    buildKernel(rows: number, cols: number, type: MorphShapes) {
      GCStore.add(this.kernel, -100);
      GCStore.add(this.out, -100);

      this.kernel = cv.getStructuringElement(
        type,
        new cv.Size(this.cols, this.rows),
        new cv.Point(this.cols / 2, this.rows / 2)
      );

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const outCols = cols * scale;
      const outRows = rows * scale;

      this.out = new cv.Mat(outRows, outCols, this.kernel.type());
      const dsize = new cv.Size(outCols, outRows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_LINEAR);

      for (let j = 0; j < outCols; j++) {
        for (let k = 0; k < outRows; k++) {
          this.out.charPtr(k, j)[0] = this.out.charPtr(k, j)[0] ? 255 : 0;
        }
      }
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}

export class CVGaussianKernelComponent extends CVFOutputComponent {
  static menu = { tabTitle: tabName, title: 'GausKernel' };

  static processor = class GaussianKernelProcessor extends CVFNodeProcessor {
    properties = [
      { name: 'sigma', type: PropertyType.Decimal },
      { name: 'rows', type: PropertyType.Integer },
      { name: 'cols', type: PropertyType.Integer },
    ];

    sigma: number = 1;
    rows: number = 5;
    cols: number = 5;
    kernel: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);
    out: Mat = new cv.Mat(this.rows, this.cols, cv.CV_32F);

    async start() {
      this.buildKernel(this.rows, this.cols, this.sigma);
    }

    async propertyChange(name: string, value: any): Promise<void> {
      this.buildKernel(
        name === 'rows' ? (value as number) : this.rows,
        name === 'cols' ? (value as number) : this.cols,
        name === 'sigma' ? (value as number) : this.sigma
      );
    }

    buildKernel(rows: number, cols: number, sigma: number) {
      GCStore.add(this.kernel, -100);
      GCStore.add(this.out, -100);

      this.kernel = new cv.Mat(rows, cols, cv.CV_32F);

      const g1 = cv.getGaussianKernel(rows, sigma, cv.CV_32F);
      const g2 = cv.getGaussianKernel(cols, sigma, cv.CV_32F);
      cv.multiply(g1, g2.t(), this.kernel, 1);

      const min = Math.min(this.kernel.rows, this.kernel.cols);
      const scale = NodeSizes.defaultHeight / min;
      const outCols = cols * scale;
      const outRows = rows * scale;

      this.out = new cv.Mat(outRows, outCols, this.kernel.type());
      const dsize = new cv.Size(outCols, outRows);
      cv.resize(this.kernel, this.out, dsize, 0, 0, cv.INTER_AREA);
    }

    async proccess() {
      this.sources = [this.kernel];

      this.output(this.out);
    }
  };
}
