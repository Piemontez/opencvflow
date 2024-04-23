import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import { XYPosition } from 'reactflow';
import { CVVideoCaptureComponent } from '../opencv/inputs';
import { NodeSizes } from '../../core/config/sizes';
import { CvtColorComponent } from '../opencv/conversors';
import { CVFComponent } from '../../ide/types/component';
import { ThresholdComponent } from '../opencv/segmentation';
import cv from 'opencv-ts';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { SampleTemplate } from '../../core/types/sample-template';

const group = 'OpenCV';

const makeXYPosition = (gridX: number, gridY: number, padding: number): XYPosition => {
  return {
    x: (NodeSizes.defaultWidth + padding) * gridX,
    y: (NodeSizes.defaultHeight + padding) * gridY,
  };
};

const ThresholdSamplesAction: SampleTemplate = {
  group,
  title: 'Thresholds',
  action: () => {
    const padding = NodeSizes.defaultWidth / 3;
    let comp: typeof CVFComponent | null;
    let gridY = -2;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    let videoId = '';
    if (comp) {
      const pos = makeXYPosition(-3, 0, padding);
      videoId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    let cvtColorId = '';
    if (comp) {
      const pos = makeXYPosition(-1, 0, padding);
      cvtColorId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Threshold BIN
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    let trash1 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash1 = useNodeStore.getState().addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_BINARY_INV as ThresholdTypes,
      }).id;
    }
    // Add Threshold TRUNC
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    let trash2 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash2 = useNodeStore.getState().addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_TRUNC as ThresholdTypes,
      }).id;
    }
    // Add Threshold TOZERO
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    let trash3 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash3 = useNodeStore.getState().addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_TOZERO as ThresholdTypes,
      }).id;
    }
    // Add Threshold OTSU
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    let trash4 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash4 = useNodeStore.getState().addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_OTSU as ThresholdTypes,
      }).id;
    }

    useNodeStore.getState().addEdge(videoId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash1, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash2, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash3, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash4, 'out', 'src1');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default ThresholdSamplesAction;
