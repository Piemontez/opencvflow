import { CVFOutputComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import { PropertyType } from '../../../ide/types/PropertyType';
import GCStore from '../../../core/contexts/GCStore';
import { Position } from 'reactflow';
import { SourceHandle } from '../../../core/types/handle';
import messages from '../messages';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VideoSizes } from '../../../core/config/sizes';
import { inputTabName } from './tabname';

/**
 * File Loader component and node
 */
class VideoCapture extends cv.VideoCapture {}
export class CVFileLoaderCaptureComponent extends CVFOutputComponent {
  static menu = {
    tabTitle: inputTabName,
    name: 'fileloader',
    title: (
      <>
        <FontAwesomeIcon icon={'upload'} /> File Loader
      </>
    ),
  };

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

    body() {
      return (
        <>
          <img style={{ display: 'none' }} ref={(ref) => (this.img = ref)} alt="" />
          <video autoPlay muted playsInline ref={(ref) => (this.video = ref)} />
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

          if (this.video) {
            this.video.src = url;
            this.video.loop = this.loop;

            this.video.onloadedmetadata = () => {
              this.video!.width = this.video!.videoWidth;
              this.video!.height = this.video!.videoHeight;
            };

            await this.video.play();
          }

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
        const src = new cv.Mat(this.video!.height!, this.video!.width!, cv.CV_8UC4);
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
