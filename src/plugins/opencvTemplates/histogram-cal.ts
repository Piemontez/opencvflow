import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { makeXYPosition } from '../../core/utils/makeXYPosition';
import cv from 'opencv-ts';
import { EqualizeHistComponent } from '../opencv/others';
import { HistogramCalcComponent } from '../utils/HistogramCalcComponent';

const group = 'OpenCV';

const HistogramCalcSamplesAction: ProjectTemplate = {
  group,
  title: 'Histogram Calculator Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-3, 0);
    const videoId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-1, 1);
    const cvtColorId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { code: cv.COLOR_BGR2GRAY }).id;
    // Add Equalize
    comp = useNodeStore.getState().getNodeType(EqualizeHistComponent.name);
    pos = makeXYPosition(-1, 2);
    const eqId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { dsize: new cv.Size(128, 128) }).id;

    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(HistogramCalcComponent.name);
    pos = makeXYPosition(0, 0);
    const eq1 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_BINARY_INV }).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(HistogramCalcComponent.name);
    pos = makeXYPosition(0, 1);
    const eq2 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_TRUNC }).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(HistogramCalcComponent.name);
    pos = makeXYPosition(0, 2);
    const eq3 = useNodeStore.getState().addNodeFromComponent(comp!, pos, { thresh: 100, type: cv.THRESH_TOZERO }).id;

    useNodeStore.getState().addEdge(videoId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, eqId, 'out', 'src1');
    useNodeStore.getState().addEdge(videoId, eq1, 'out', 'image');
    useNodeStore.getState().addEdge(cvtColorId, eq2, 'out', 'image');
    useNodeStore.getState().addEdge(eqId, eq3, 'out', 'image');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default HistogramCalcSamplesAction;
