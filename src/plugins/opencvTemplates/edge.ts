import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { makeXYPosition } from '../../core/utils/makeXYPosition';
import cv from 'opencv-ts';
import { EqualizeHistComponent } from '../opencv/others';
import { SobelComponent, CannyComponent, LaplacianComponent } from '../opencv/edge';
import { GaussianBlurComponent } from '../opencv/smoothing';

const group = 'OpenCV';

const EdgeSamplesAction: ProjectTemplate = {
  group,
  title: 'Edges Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-3, 0);
    const videoId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-1, -1);
    const cvtColorId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { code: cv.COLOR_BGR2GRAY }).id;
    // Add Convert
    comp = useNodeStore.getState().getNodeType(GaussianBlurComponent.name);
    pos = makeXYPosition(-1, 0);
    const gaussianBlurId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { code: cv.COLOR_BGR2GRAY }).id;
    // Add Equalize
    comp = useNodeStore.getState().getNodeType(EqualizeHistComponent.name);
    pos = makeXYPosition(-1, 1);
    const eqId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { dsize: new cv.Size(128, 128) }).id;

    // Add SobelComponent
    comp = useNodeStore.getState().getNodeType(SobelComponent.name);
    pos = makeXYPosition(1, -2);
    const sobel01Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add SobelComponent
    comp = useNodeStore.getState().getNodeType(SobelComponent.name);
    pos = makeXYPosition(2, -2);
    const sobel02Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add SobelComponent
    comp = useNodeStore.getState().getNodeType(SobelComponent.name);
    pos = makeXYPosition(3, -2);
    const sobel03Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(CannyComponent.name);
    pos = makeXYPosition(1, 0);
    const canny01Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(CannyComponent.name);
    pos = makeXYPosition(2, 0);
    const canny02Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(CannyComponent.name);
    pos = makeXYPosition(3, 0);
    const canny03Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(LaplacianComponent.name);
    pos = makeXYPosition(1, 2);
    const laplacian01Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(LaplacianComponent.name);
    pos = makeXYPosition(2, 2);
    const laplacian02Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add HistogramCalcComponent
    comp = useNodeStore.getState().getNodeType(LaplacianComponent.name);
    pos = makeXYPosition(3, 2);
    const laplacian03Id = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    useNodeStore.getState().addEdge(videoId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, gaussianBlurId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, eqId, 'out', 'src1');

    useNodeStore.getState().addEdge(cvtColorId, sobel01Id, 'out', 'src1');
    useNodeStore.getState().addEdge(gaussianBlurId, sobel02Id, 'out', 'src1');
    useNodeStore.getState().addEdge(eqId, sobel03Id, 'out', 'src1');

    useNodeStore.getState().addEdge(cvtColorId, canny01Id, 'out', 'src1');
    useNodeStore.getState().addEdge(gaussianBlurId, canny02Id, 'out', 'src1');
    useNodeStore.getState().addEdge(eqId, canny03Id, 'out', 'src1');

    useNodeStore.getState().addEdge(cvtColorId, laplacian01Id, 'out', 'src1');
    useNodeStore.getState().addEdge(gaussianBlurId, laplacian02Id, 'out', 'src1');
    useNodeStore.getState().addEdge(eqId, laplacian03Id, 'out', 'src1');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default EdgeSamplesAction;
