import NodeStore from 'renderer/contexts/NodeStore';
import {
  ClosingComponent,
  DilateComponent,
  ErodeComponent,
  MorphologyExComponent,
  OpeningComponent,
} from 'plugins/opencv/morphology';
import { MenuActionProps } from 'renderer/types/menu';
import { XYPosition } from 'react-flow-renderer';
import {
  CVKernelComponent,
  CVVideoCaptureComponent,
} from 'plugins/opencv/inputs';
import { NodeSizes } from 'renderer/config/sizes';
import { CvtColorComponent } from 'plugins/opencv/conversors';
import { CVFComponent } from 'renderer/types/component';

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
    comp = NodeStore.getNodeType(CVVideoCaptureComponent.name);
    let videoId = '';
    if (comp) {
      const pos = makeXYPosition(-3, 0, padding);
      videoId = NodeStore.addNodeFromComponent(comp, pos).id;
    }
    comp = NodeStore.getNodeType(CVKernelComponent.name);
    let kernelId = '';
    if (comp) {
      const pos = makeXYPosition(-2, 2, padding);
      kernelId = NodeStore.addNodeFromComponent(comp, pos).id;
    }

    // Add Convert
    comp = NodeStore.getNodeType(CvtColorComponent.name);
    let cvtColorId = '';
    if (comp) {
      const pos = makeXYPosition(-1, 0, padding);
      cvtColorId = NodeStore.addNodeFromComponent(comp, pos).id;
    }

    // Add Erode
    comp = NodeStore.getNodeType(ErodeComponent.name);
    let erodeId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      erodeId = NodeStore.addNodeFromComponent(comp, pos).id;
    }
    // Add Dilate
    comp = NodeStore.getNodeType(DilateComponent.name);
    let dilateId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      dilateId = NodeStore.addNodeFromComponent(comp, pos).id;
    }
    // Add Oppening
    comp = NodeStore.getNodeType(OpeningComponent.name);
    let opId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      opId = NodeStore.addNodeFromComponent(comp, pos).id;
    }
    // Add Clossi
    comp = NodeStore.getNodeType(ClosingComponent.name);
    let closeId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      closeId = NodeStore.addNodeFromComponent(comp, pos).id;
    }
    // Add Morph
    comp = NodeStore.getNodeType(MorphologyExComponent.name);
    let morphId = '';
    if (comp) {
      const pos = makeXYPosition(0, gridY++, padding);
      morphId = NodeStore.addNodeFromComponent(comp, pos).id;
    }

    NodeStore.addEdge(videoId, cvtColorId, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, erodeId, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, dilateId, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, opId, 'out', 'src1');
    NodeStore.addEdge(cvtColorId, closeId, 'out', 'src1');

    NodeStore.addEdge(cvtColorId, morphId, 'out', 'src');
    NodeStore.addEdge(kernelId, morphId, 'out', 'kernel');

    setTimeout(NodeStore.fitView, 100);
  },
};

export default MorphologySamplesAction;
