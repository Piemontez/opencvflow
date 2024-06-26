import { CVFOutputComponent } from '../../../ide/components/NodeComponent';
import { CVFNodeProcessor } from '../../../core/types/node';
import cv from 'opencv-ts';
import GCStore from '../../../core/contexts/GCStore';
import { Position } from 'reactflow';
import { SourceHandle } from '../../../core/types/handle';
import { VideoSizes } from '../../../core/config/sizes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { inputTabName } from './tabname';

/**
 * Video Capture component and node
 */
class VideoCapture extends cv.VideoCapture {}
export class CVVideoCaptureComponent extends CVFOutputComponent {
  static menu = {
    tabTitle: inputTabName,
    name: 'Video Capture',
    title: (
      <>
        <FontAwesomeIcon icon={'video'} /> Video Capture
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
      return <video autoPlay width={VideoSizes.minWidth} height={VideoSizes.minHeight} muted playsInline ref={(ref) => (this.video = ref)} />;
    }

    async start() {
      this.cap = new cv.VideoCapture(this.video!);

      await navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then((mediaStream) => {
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
        const src = new cv.Mat(this.video!.height!, this.video!.width!, cv.CV_8UC4);
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
