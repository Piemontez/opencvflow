import { ClosingComponent, DilateComponent, ErodeComponent, MorphologyExComponent, OpeningComponent } from '../opencv/morphology';
import { XYPosition } from 'reactflow';
import { CVKernelComponent } from '../opencv/inputs/CVKernelComponent';
import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { NodeSizes } from '../../core/config/sizes';
import { CvtColorComponent } from '../opencv/conversors';
import { CVFComponent } from '../../ide/types/component';
import { ProjectTemplate } from '../../core/types/project-template';
import { CVResizeComponent } from '../opencv/geometricTransformations';
import { useNodeStore } from '../../core/contexts/NodeStore';
import cv from 'opencv-ts';
import { ThresholdComponent } from '../opencv/segmentation';

const group = 'OpenCV';

const makeXYPosition = (gridX: number, gridY: number, padding: number): XYPosition => {
  return {
    x: (NodeSizes.defaultWidth + padding) * gridX,
    y: (NodeSizes.defaultHeight + padding) * gridY,
  };
};

const MorphologySamplesAction: ProjectTemplate = {
  group,
  title: 'Morphology Samples',
  action: () => {
    const padding = NodeSizes.defaultWidth / 3;
    let comp: typeof CVFComponent | null;
    let gridY = -2;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    let videoId = '';
    if (comp) {
      const pos = makeXYPosition(-4, 0, padding);
      videoId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Kernel
    comp = useNodeStore.getState().getNodeType(CVKernelComponent.name);
    let kernelId = '';
    if (comp) {
      const pos = makeXYPosition(-2, 2, padding);
      kernelId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Resize
    comp = useNodeStore.getState().getNodeType(CVResizeComponent.name);
    let resizeId = '';
    if (comp) {
      const pos = makeXYPosition(-2, -1, padding);
      resizeId = useNodeStore.getState().addNodeFromComponent(comp, pos, { dsize: new cv.Size(128, 128) }).id;
    }

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    let cvtColorId = '';
    if (comp) {
      const pos = makeXYPosition(-2, 0, padding);
      cvtColorId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Threshold BIN
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    let trash1 = '';
    if (comp) {
      const pos = makeXYPosition(-1, 0, padding);
      trash1 = useNodeStore.getState().addNodeFromComponent(comp, pos, { thresh: 100, type: cv.THRESH_BINARY_INV }).id;
    }

    // Add Erode
    comp = useNodeStore.getState().getNodeType(ErodeComponent.name);
    let erodeId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      erodeId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }
    // Add Dilate
    comp = useNodeStore.getState().getNodeType(DilateComponent.name);
    let dilateId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      dilateId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }
    // Add Oppening
    comp = useNodeStore.getState().getNodeType(OpeningComponent.name);
    let opId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      opId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }
    // Add Clossi
    comp = useNodeStore.getState().getNodeType(ClosingComponent.name);
    let closeId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      closeId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }
    // Add Morph
    comp = useNodeStore.getState().getNodeType(MorphologyExComponent.name);
    let morphId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      morphId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    useNodeStore.getState().addEdge(videoId, resizeId, 'out', 'src1');
    useNodeStore.getState().addEdge(resizeId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash1, 'out', 'src1');
    useNodeStore.getState().addEdge(trash1, erodeId, 'out', 'src1');
    useNodeStore.getState().addEdge(trash1, dilateId, 'out', 'src1');
    useNodeStore.getState().addEdge(trash1, opId, 'out', 'src1');
    useNodeStore.getState().addEdge(trash1, closeId, 'out', 'src1');

    useNodeStore.getState().addEdge(trash1, morphId, 'out', 'src');
    useNodeStore.getState().addEdge(kernelId, morphId, 'out', 'kernel');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default MorphologySamplesAction;
