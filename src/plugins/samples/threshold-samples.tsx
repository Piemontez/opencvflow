import NodeStore from 'renderer/contexts/NodeStore';
import { MenuActionProps } from 'renderer/types/menu';
import { ThresholdTypes } from 'opencv-ts/src/ImageProcessing/Misc';
import { XYPosition } from 'react-flow-renderer';
import { CVVideoCaptureComponent } from 'plugins/opencv/inputs';
import { NodeSizes } from 'renderer/config/sizes';
import { CvtColorComponent } from 'plugins/opencv/conversors';
import { CVFComponent } from 'renderer/types/component';
import { ThresholdComponent } from 'plugins/opencv/segmentation';
import cv from 'opencv-ts';

const tabName = 'Samples';

const makeXYPosition = (
  gridX: number,
  gridY: number,
  padding: number
): XYPosition => {
  return {
    x: (NodeSizes.defaultWidth + padding) * gridX,
    y: (NodeSizes.defaultHeight + padding) * gridY,
  };
};

const ThresholdSamplesAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'thresholdSamples',
  title: 'Threshold Samples',
  position: 'rigth',
  dropdown: true,
  action: () => {
    const padding = NodeSizes.defaultWidth / 3;
    let comp: typeof CVFComponent | null;
    let gridY = -2;

    // Add Video
    comp = NodeStore.getNodeType(CVVideoCaptureComponent.name);
    let videoId = '';
    if (comp) {
      const pos = makeXYPosition(-3, 0, padding);
      videoId = NodeStore.addNodeFromComponent(comp, pos).id;
    }

    // Add Convert
    comp = NodeStore.getNodeType(CvtColorComponent.name);
    let cvtColorId = '';
    if (comp) {
      const pos = makeXYPosition(-1, 0, padding);
      cvtColorId = NodeStore.addNodeFromComponent(comp, pos).id;
    }

    // Add Threshold BIN
    comp = NodeStore.getNodeType(ThresholdComponent.name);
    let trash1 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash1 = NodeStore.addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_BINARY_INV as ThresholdTypes,
      }).id;
    }
    // Add Threshold TRUNC
    comp = NodeStore.getNodeType(ThresholdComponent.name);
    let trash2 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash2 = NodeStore.addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_TRUNC as ThresholdTypes,
      }).id;
    }
    // Add Threshold TOZERO
    comp = NodeStore.getNodeType(ThresholdComponent.name);
    let trash3 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash3 = NodeStore.addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_TOZERO as ThresholdTypes,
      }).id;
    }
    // Add Threshold OTSU
    comp = NodeStore.getNodeType(ThresholdComponent.name);
    let trash4 = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      trash4 = NodeStore.addNodeFromComponent(comp, pos, {
        thresh: 100,
        type: cv.THRESH_OTSU as ThresholdTypes,
      }).id;
    }

    NodeStore.addEdge(videoId, cvtColorId, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, trash1, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, trash2, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, trash3, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, trash4, 'out', 'src1');

    setTimeout(NodeStore.fitView, 100);
  },
};

export default ThresholdSamplesAction;
