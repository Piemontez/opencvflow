import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { makeXYPosition } from '../../core/utils/makeXYPosition';
import cv from 'opencv-ts';
import { InRangeComponent } from '../opencv/others';
import { CVHSVRangeComponent } from '../opencv/inputs';
import { CVBitwiseAndComponent, CVBitwiseOrComponent } from '../opencv/arithmetic';

const group = 'OpenCV';

const ColorsFiltersSamplesAction: ProjectTemplate = {
  group,
  title: 'Colors Filters Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-3, 0.5);
    const videoId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-1, 1);
    const cvtColorId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { code: cv.COLOR_RGB2HSV }).id;

    // Add CVHSVRangeComponent
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 2);
    const hsvRed1 = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 170, hueMax: 180, saturationMin: 0, saturationMax: 255, valueMin: 0, valueMax: 255 }).id;
    // Add CVHSVRangeComponent
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 3);
    const hsvRed2 = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 0, hueMax: 15, saturationMin: 100, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 2);
    const inRangeRed1 = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    // Add CVHSVRangeComponent
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 3);
    const inRangeRed2 = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVBitwiseOrComponent
    comp = useNodeStore.getState().getNodeType(CVBitwiseOrComponent.name);
    pos = makeXYPosition(1, 2);
    const orRed = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVBitwiseOrComponent
    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 0.5);
    const andVideoRed = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Edges
    useNodeStore.getState().addEdge(videoId, cvtColorId, 'out', 'src1');

    // InRange red
    useNodeStore.getState().addEdge(cvtColorId, inRangeRed1, 'out', 'src1');
    useNodeStore.getState().addEdge(hsvRed1, inRangeRed1, 'min', 'min');
    useNodeStore.getState().addEdge(hsvRed1, inRangeRed1, 'max', 'max');

    useNodeStore.getState().addEdge(cvtColorId, inRangeRed2, 'out', 'src1');
    useNodeStore.getState().addEdge(hsvRed2, inRangeRed2, 'min', 'min');
    useNodeStore.getState().addEdge(hsvRed2, inRangeRed2, 'max', 'max');

    // HSV Red
    useNodeStore.getState().addEdge(videoId, hsvRed1, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoId, hsvRed1, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvRed1, 'type', 'type');

    useNodeStore.getState().addEdge(videoId, hsvRed2, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoId, hsvRed2, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvRed2, 'type', 'type');

    // OR red 1 e 2
    useNodeStore.getState().addEdge(hsvRed1, orRed, 'out', 'src1');
    useNodeStore.getState().addEdge(hsvRed2, orRed, 'out', 'src2');

    // AND video e red
    useNodeStore.getState().addEdge(videoId, andVideoRed, 'out', 'src1');
    useNodeStore.getState().addEdge(videoId, andVideoRed, 'out', 'src2');
    useNodeStore.getState().addEdge(orRed, andVideoRed, 'out', 'masc');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default ColorsFiltersSamplesAction;
