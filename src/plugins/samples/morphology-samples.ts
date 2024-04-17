import { ClosingComponent, DilateComponent, ErodeComponent, MorphologyExComponent, OpeningComponent } from '../opencv/morphology';
import { MenuActionProps } from '../../ide/types/menu';
import { XYPosition } from 'reactflow';
import { CVKernelComponent, CVVideoCaptureComponent } from '../opencv/inputs';
import { NodeSizes } from '../../core/config/sizes';
import { CvtColorComponent } from '../opencv/conversors';
import { CVFComponent } from '../../ide/types/component';
import { useNodeStore } from '../../core/contexts/NodeStore';

const tabName = 'Samples';

const makeXYPosition = (gridX: number, gridY: number, padding: number): XYPosition => {
  return {
    x: (NodeSizes.defaultWidth + padding) * gridX,
    y: (NodeSizes.defaultHeight + padding) * gridY,
  };
};

const MorphologySamplesAction: MenuActionProps = {
  tabTitle: tabName,
  name: 'morphSamples',
  title: 'Morphology Samples',
  position: 'rigth',
  dropdown: true,
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
    comp = useNodeStore.getState().getNodeType(CVKernelComponent.name);
    let kernelId = '';
    if (comp) {
      const pos = makeXYPosition(-2, 2, padding);
      kernelId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
    }

    // Add Convert
    comp = useNodeStore.getState().getNodeType(CvtColorComponent.name);
    let cvtColorId = '';
    if (comp) {
      const pos = makeXYPosition(-1, 0, padding);
      cvtColorId = useNodeStore.getState().addNodeFromComponent(comp, pos).id;
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

    useNodeStore.getState().addEdge(videoId, cvtColorId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, erodeId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, dilateId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, opId, 'out', 'src1');
    useNodeStore.getState().addEdge(cvtColorId, closeId, 'out', 'src1');

    useNodeStore.getState().addEdge(cvtColorId, morphId, 'out', 'src');
    useNodeStore.getState().addEdge(kernelId, morphId, 'out', 'kernel');

    setTimeout(useNodeStore.getState().fitView, 100);
  },
};

export default MorphologySamplesAction;
