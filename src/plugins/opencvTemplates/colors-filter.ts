import { CVVideoCaptureComponent } from '../opencv/inputs/CVVideoCaptureComponent';
import { CvtColorComponent } from '../opencv/conversors/CvtColorComponent';
import { CVFComponent } from '../../ide/components/NodeComponent';
import { useNodeStore } from '../../core/contexts/NodeStore';
import { ProjectTemplate } from '../../core/types/project-template';
import { makeXYPosition } from '../../core/utils/makeXYPosition';
import cv from 'opencv-ts';
import { InRangeComponent } from '../opencv/others';
import { CVFileLoaderCaptureComponent, CVHSVRangeComponent } from '../opencv/inputs';
import { CVBitwiseAndComponent, CVBitwiseOrComponent } from '../opencv/arithmetic';
import { MapPropertiesComponent } from '../utils/MapPropertiesComponent';

const group = 'OpenCV';

const ColorsFiltersSamplesAction: ProjectTemplate = {
  group,
  title: 'Colors Filters Samples',
  action: () => {
    let comp: typeof CVFComponent | null;
    let pos;

    // Add Video
    comp = useNodeStore.getState().getNodeType(CVVideoCaptureComponent.name);
    pos = makeXYPosition(-4, 0.5);
    const videoId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVFileLoaderCaptureComponent.name);
    pos = makeXYPosition(-3, 2);
    useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(MapPropertiesComponent.name);
    pos = makeXYPosition(-2, 1);
    const videoPropsId = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    pos = makeXYPosition(-1, 1);
    const cvtColorId = useNodeStore.getState().addNodeFromComponent(comp!, pos, { code: cv.COLOR_RGB2HSV }).id;

    // Add CVHSVRangeComponent RED
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 2);
    const hsvRed1 = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 170, hueMax: 180, saturationMin: 0, saturationMax: 255, valueMin: 0, valueMax: 255 }).id;
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 3);
    const hsvRed2 = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 0, hueMax: 15, saturationMin: 100, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent YELLOW
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 4);
    const hsvYellow = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 20, hueMax: 40, saturationMin: 30, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent GREEN
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 5);
    const hsvGreen = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 40, hueMax: 80, saturationMin: 30, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent BLUE
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 6);
    const hsvBlue = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 100, hueMax: 140, saturationMin: 30, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent CYAN
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 7);
    const hsvCyan = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 80, hueMax: 90, saturationMin: 30, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent PURPLE
    comp = useNodeStore.getState().getNodeType(CVHSVRangeComponent.name);
    pos = makeXYPosition(-1, 8);
    const hsvPurple = useNodeStore
      .getState()
      .addNodeFromComponent(comp!, pos, { hueMin: 140, hueMax: 160, saturationMin: 30, saturationMax: 255, valueMin: 70, valueMax: 255 }).id;

    // Add CVHSVRangeComponent Red
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 2);
    const inRangeRed1 = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 3);
    const inRangeRed2 = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVHSVRangeComponent Yellow
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 4);
    const inRangeYellow = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVHSVRangeComponent Green
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 5);
    const inRangeGreen = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVHSVRangeComponent Blue
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 6);
    const inRangeBlue = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVHSVRangeComponent Cyan
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 7);
    const inRangeCyan = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVHSVRangeComponent Purple
    comp = useNodeStore.getState().getNodeType(InRangeComponent.name);
    pos = makeXYPosition(0, 8);
    const inRangePurple = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVBitwiseOrComponent
    comp = useNodeStore.getState().getNodeType(CVBitwiseOrComponent.name);
    pos = makeXYPosition(1, 2);
    const orRed = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Add CVBitwiseAndComponent
    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 2);
    const andVideoRed = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 4);
    const andVideoYellow = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 5);
    const andVideoGreen = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 6);
    const andVideoBlue = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 7);
    const andVideoCyan = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    comp = useNodeStore.getState().getNodeType(CVBitwiseAndComponent.name);
    pos = makeXYPosition(2, 8);
    const andVideoPurple = useNodeStore.getState().addNodeFromComponent(comp!, pos).id;

    // Edges
    useNodeStore.getState().addEdge(videoId, videoPropsId, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, cvtColorId, 'out', 'src1');

    // InRange red
    useNodeStore.getState().addEdge(cvtColorId, inRangeRed1, 'out', 'src');
    useNodeStore.getState().addEdge(hsvRed1, inRangeRed1, 'min', 'min');
    useNodeStore.getState().addEdge(hsvRed1, inRangeRed1, 'max', 'max');

    useNodeStore.getState().addEdge(cvtColorId, inRangeRed2, 'out', 'src');
    useNodeStore.getState().addEdge(hsvRed2, inRangeRed2, 'min', 'min');
    useNodeStore.getState().addEdge(hsvRed2, inRangeRed2, 'max', 'max');

    // InRange
    useNodeStore.getState().addEdge(cvtColorId, inRangeYellow, 'out', 'src');
    useNodeStore.getState().addEdge(hsvYellow, inRangeYellow, 'min', 'min');
    useNodeStore.getState().addEdge(hsvYellow, inRangeYellow, 'max', 'max');

    // InRange
    useNodeStore.getState().addEdge(cvtColorId, inRangeGreen, 'out', 'src');
    useNodeStore.getState().addEdge(hsvGreen, inRangeGreen, 'min', 'min');
    useNodeStore.getState().addEdge(hsvGreen, inRangeGreen, 'max', 'max');

    // InRange
    useNodeStore.getState().addEdge(cvtColorId, inRangeBlue, 'out', 'src');
    useNodeStore.getState().addEdge(hsvBlue, inRangeBlue, 'min', 'min');
    useNodeStore.getState().addEdge(hsvBlue, inRangeBlue, 'max', 'max');

    // InRange
    useNodeStore.getState().addEdge(cvtColorId, inRangeCyan, 'out', 'src');
    useNodeStore.getState().addEdge(hsvCyan, inRangeCyan, 'min', 'min');
    useNodeStore.getState().addEdge(hsvCyan, inRangeCyan, 'max', 'max');

    // InRange
    useNodeStore.getState().addEdge(cvtColorId, inRangePurple, 'out', 'src');
    useNodeStore.getState().addEdge(hsvPurple, inRangePurple, 'min', 'min');
    useNodeStore.getState().addEdge(hsvPurple, inRangePurple, 'max', 'max');

    // HSV Red
    useNodeStore.getState().addEdge(videoPropsId, hsvRed1, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvRed1, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvRed1, 'type', 'type');

    useNodeStore.getState().addEdge(videoPropsId, hsvRed2, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvRed2, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvRed2, 'type', 'type');

    // HSV
    useNodeStore.getState().addEdge(videoPropsId, hsvYellow, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvYellow, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvYellow, 'type', 'type');

    // HSV
    useNodeStore.getState().addEdge(videoPropsId, hsvGreen, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvGreen, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvGreen, 'type', 'type');

    // HSV
    useNodeStore.getState().addEdge(videoPropsId, hsvBlue, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvBlue, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvBlue, 'type', 'type');

    // HSV
    useNodeStore.getState().addEdge(videoPropsId, hsvCyan, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvCyan, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvCyan, 'type', 'type');

    // HSV
    useNodeStore.getState().addEdge(videoPropsId, hsvPurple, 'rows', 'rows');
    useNodeStore.getState().addEdge(videoPropsId, hsvPurple, 'cols', 'cols');
    useNodeStore.getState().addEdge(cvtColorId, hsvPurple, 'type', 'type');

    // OR red 1 e 2
    useNodeStore.getState().addEdge(inRangeRed1, orRed, 'out', 'src1');
    useNodeStore.getState().addEdge(inRangeRed2, orRed, 'out', 'src2');

    // AND video e red
    useNodeStore.getState().addEdge(videoPropsId, andVideoRed, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoRed, 'out', 'src2');
    useNodeStore.getState().addEdge(orRed, andVideoRed, 'out', 'masc');

    // AND
    useNodeStore.getState().addEdge(videoPropsId, andVideoYellow, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoYellow, 'out', 'src2');
    useNodeStore.getState().addEdge(inRangeYellow, andVideoYellow, 'out', 'masc');

    // AND
    useNodeStore.getState().addEdge(videoPropsId, andVideoGreen, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoGreen, 'out', 'src2');
    useNodeStore.getState().addEdge(inRangeGreen, andVideoGreen, 'out', 'masc');

    // AND
    useNodeStore.getState().addEdge(videoPropsId, andVideoBlue, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoBlue, 'out', 'src2');
    useNodeStore.getState().addEdge(inRangeBlue, andVideoBlue, 'out', 'masc');

    // AND
    useNodeStore.getState().addEdge(videoPropsId, andVideoCyan, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoCyan, 'out', 'src2');
    useNodeStore.getState().addEdge(inRangeCyan, andVideoCyan, 'out', 'masc');

    // AND
    useNodeStore.getState().addEdge(videoPropsId, andVideoPurple, 'out', 'src1');
    useNodeStore.getState().addEdge(videoPropsId, andVideoPurple, 'out', 'src2');
    useNodeStore.getState().addEdge(inRangePurple, andVideoPurple, 'out', 'masc');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default ColorsFiltersSamplesAction;
