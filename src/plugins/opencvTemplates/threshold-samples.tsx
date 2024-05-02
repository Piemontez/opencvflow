import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { ThresholdComponent } from '../opencv/segmentation/ThresholdComponent';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { CVResizeComponent } from '../opencv/geometricTransformations';
import { makeXYPosition } from '../../core/utils/makeXYPosition';
import cv from 'opencv-ts';

const group = 'OpenCV';

const ThresholdSamplesAction: ProjectTemplate = {
  group,
  title: 'Threshold Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-3, 0);
    const videoId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Resize
    comp = useNodeStore.getState().getNodeType(CVResizeComponent.name);
    pos = makeXYPosition(-1, -1);
    const resizeId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { dsize: new cv.Size(128, 128) }).id;
    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-1, 0);
    const cvtColorId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Threshold BIN
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    pos = makeXYPosition(0, -2);
    const trash1 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_BINARY_INV }).id;
    // Add Threshold TRUNC
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    pos = makeXYPosition(0, -1);
    const trash2 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_TRUNC }).id;
    // Add Threshold TOZERO
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    pos = makeXYPosition(0, -0);
    const trash3 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_TOZERO }).id;
    // Add Threshold OTSU
    comp = useNodeStore.getState().getNodeType(ThresholdComponent.name);
    pos = makeXYPosition(0, 1);
    const trash4 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_OTSU }).id;

    useNodeStore.getState().addEdge(videoId, resizeId, 'out', 'src1');
    useNodeStore.getState().addEdge(resizeId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash1, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash2, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash3, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, trash4, 'out', 'src1');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default ThresholdSamplesAction;
