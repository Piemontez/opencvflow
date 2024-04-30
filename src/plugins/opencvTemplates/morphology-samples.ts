import { MorphologyExComponent } from '../opencv/morphology/MorphologyExComponent';
import { ClosingComponent } from '../opencv/morphology/ClosingComponent';
import { OpeningComponent } from '../opencv/morphology/OpeningComponent';
import { DilateComponent } from '../opencv/morphology/DilateComponent';
import { ErodeComponent } from '../opencv/morphology/ErodeComponent';
import { CVKernelComponent } from '../opencv/inputs/CVKernelComponent';
import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/types/component';
import { ProjectTemplate } from '../../core/types/project-template';
import { CVResizeComponent } from '../opencv/geometricTransformations';
import { useNodeStore } from '../../core/contexts/NodeStore';
import cv from 'opencv-ts';
import { ThresholdComponent } from '../opencv/segmentation/ThresholdComponent';
import { makeXYPosition } from '../../core/utils/makeXYPosition';

const group = 'OpenCV';

const MorphologySamplesAction: ProjectTemplate = {
  group,
  title: 'Morphology Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;
    let gridY = -2;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-4, 0);
    let videoId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;

    // Add Kernel
    comp = useNodeStore.getState().getNodeType(CVKernelComponent.name);
    pos = makeXYPosition(-2, 2);
    let kernelId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;

    // Add Resize
    comp = useNodeStore.getState().getNodeType(CVResizeComponent.name);
    pos = makeXYPosition(-2, -1);
    let resizeId = useNodeStore.getState().addNodeFromComponent(comp, pos, { dsize: new cv.Size(128, 128) }).id;

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-2, 0);
    let cvtColorId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;

    // Add Threshold BIN
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    pos = makeXYPosition(0, gridY++);
    let trash1 = useNodeStore.getState().addNodeFromComponent(comp, pos, { thresh: 100, type: cv.THRESH_BINARY_INV }).id;

    // Add Erode
    comp = useNodeStore.getState().getNodeType(ErodeComponent.name);
    let erodeId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    // Add Dilate
    comp = useNodeStore.getState().getNodeType(DilateComponent.name);
    pos = makeXYPosition(0, gridY++);
    let dilateId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    // Add Oppening
    comp = useNodeStore.getState().getNodeType(OpeningComponent.name);
    pos = makeXYPosition(0, gridY++);
    let opId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    // Add Clossi
    comp = useNodeStore.getState().getNodeType(ClosingComponent.name);
    pos = makeXYPosition(0, gridY++);
    let closeId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    // Add Morph
    comp = useNodeStore.getState().getNodeType(MorphologyExComponent.name);
    pos = makeXYPosition(0, gridY++);
    let morphId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;

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
