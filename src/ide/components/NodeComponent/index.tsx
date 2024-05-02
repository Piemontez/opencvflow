import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'reactflow';
import NodeDisplay, { NodeZoom } from '../NodeDisplay';
import NodeTab from '../NodeTab';
import { NodeSizes } from '../../../core/config/sizes';
import GCStore from '../../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { ComponentMenuAction, MenuWithElementTitleProps } from '../../types/menu';
import { CVFNodeData, CVFNodeProcessor } from '../../../core/types/node';
import { Zoom } from '../../types/Zoom';
import { ZOOM_BOX_SIZE, ZOOM_BOX_SIZE_HALF } from '../../commons/consts';

type OCVComponentProps = {
  id: string;
  data: CVFNodeData;
  type: string;
};

type ZoomIn = {
  x: number;
  y: number;
  width: number;
};
type OCVComponentState = {
  scale: number | 'AUTO_SCALE';
  zoomIn?: ZoomIn;
  options: number;
};

export enum CVFComponentOptions {
  NONE = 0,
  NOT_DISPLAY = 1,
  NEXT_OPTION_02 = 2,
  NEXT_OPTION_01 = 4,
}

class EmptyNodeProcessor extends CVFNodeProcessor {}
class ForkCVFNodeProcessor extends CVFNodeProcessor {}
type OCVComponentProcessor = typeof ForkCVFNodeProcessor;

/**
 * Componente/NodeType
 */
export abstract class CVFComponent extends React.Component<OCVComponentProps, OCVComponentState> {
  private canvasRef: HTMLCanvasElement | null = null;
  private canvasZoomRef: HTMLCanvasElement | null = null;
  // Conexões que o componente pode receber
  targets: TargetHandle[] = [];
  // Conexões que o componente irá disparar
  sources: SourceHandle[] = [];
  // Função responsável em instanciar o NodeProcessor
  static processor: OCVComponentProcessor = EmptyNodeProcessor;
  // Definição do menu que ira aparecer
  static menu?: ComponentMenuAction;
  // Opções
  state = {
    scale: Zoom.PERC_AUTO as Zoom,
    zoomIn: undefined as ZoomIn | undefined,
    options: CVFComponentOptions.NONE,
  };

  // Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    const { menu } = this.constructor as typeof CVFComponent;
    return (menu as MenuWithElementTitleProps)?.name || (menu?.title as string) || this.constructor.name;
  }

  changeScale(scale: Zoom) {
    this.setState({ scale });
  }

  showZoom(x: number, y: number) {
    const { left, top, width } = this.canvasRef!.getBoundingClientRect();

    x = x - Math.floor(left);
    y = y - Math.floor(top);
    this.setState({
      zoomIn: { x, y, width: Math.floor(width) },
    });
  }

  hideZoom = () => {
    this.setState({
      zoomIn: undefined,
    });
  };

  addOption(opt: number) {
    const { options } = this.state;
    this.setState({
      options: options | opt,
    });
  }

  removeOption(opt: number) {
    const { options } = this.state;
    this.setState({
      options: options & ~opt,
    });
  }

  componentDidMount() {
    this.initOutputs();
  }

  initOutputs() {
    const { data } = this.props;
    const { processor } = data;

    processor.componentPointer = { current: this };

    processor.output = this.output;
    processor.outputMsg = this.outputMsg;
  }

  output = (mat: Mat) => {
    if (this.canvasRef) {
      const { scale: zoom, options } = this.state;
      const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
      if (notDisplay) {
        return;
      }

      let out: Mat;
      if (Zoom.PERC_100 === zoom) {
        out = mat;
      } else {
        let cols;
        let rows;
        if (zoom === 'AUTO_SCALE') {
          const min = Math.min(mat.rows, mat.cols);
          const scale = NodeSizes.defaultHeight / min;
          cols = mat.cols * scale;
          rows = mat.rows * scale;
        } else {
          rows = mat.rows * zoom;
          cols = mat.cols * zoom;
        }

        out = GCStore.add(new cv.Mat(rows, cols, mat.type()));
        cv.resize(mat, out, new cv.Size(cols, rows), 0, 0, cv.INTER_NEAREST);
      }
      cv.imshow(this.canvasRef, out);

      this.outputZoom(mat);
    }
  };

  outputZoom = (mat: Mat) => {
    if (this.canvasZoomRef && this.state.zoomIn) {
      let { x, y, width } = this.state.zoomIn;
      const scale = mat.cols / width;

      x = Math.max(Math.min(x * scale + ZOOM_BOX_SIZE_HALF, mat.rows) - ZOOM_BOX_SIZE_HALF, 0);
      y = Math.max(Math.min(y * scale + ZOOM_BOX_SIZE_HALF, mat.rows) - ZOOM_BOX_SIZE_HALF, 0);

      const zoom = GCStore.add(mat.roi(new cv.Rect(x, y, ZOOM_BOX_SIZE, ZOOM_BOX_SIZE)));
      const resize = GCStore.add(new cv.Mat());
      cv.resize(zoom, resize, new cv.Size(NodeSizes.defaultWidth, NodeSizes.defaultHeight), 0, 0, cv.INTER_NEAREST);
      cv.imshow(this.canvasZoomRef, resize);
    }
  };

  outputMsg = (msg: string) => {
    if (this.canvasRef) {
      const ctx = this.canvasRef.getContext('2d');
      if (ctx) {
        ctx.fillText(msg, 15, 15);
      }
    }
  };

  render() {
    const { zoomIn } = this.state;
    const { data } = this.props;
    const { processor } = data;
    return (
      <div className="node">
        {processor.header()}

        {this.targets.map((target, idx) => (
          <Handle
            id={target.title}
            key={target.title}
            type="target"
            position={target.position}
            style={{
              content: target.title,
              top: 40 + 40 * idx,
              borderRadius: 0,
            }}
          >
            <div className="handle-title">{target.title}</div>
          </Handle>
        ))}

        <NodeTab component={this} />

        <div className="node-body">
          {!!zoomIn && (
            <NodeZoom canvasRef={(ref) => (this.canvasZoomRef = ref)} pos={zoomIn} scale={(this.canvasRef?.width || 1) / (zoomIn?.width || 1)} />
          )}

          {processor.body() || (
            <NodeDisplay
              component={this}
              canvasRef={(ref) => (this.canvasRef = ref)}
              onMouseMove={(ev) => this.showZoom(ev.clientX, ev.clientY)}
              onMouseLeave={this.hideZoom}
            />
          )}
        </div>

        {this.sources.map((source, idx) => (
          <Handle id={source.title} key={source.title} type="source" position={source.position} style={{ top: 40 + 40 * idx, borderRadius: 0 }}>
            <div className="handle-title">{source.title}</div>
          </Handle>
        ))}
      </div>
    );
  }
}

export abstract class CVFOutputComponent extends CVFComponent {
  // Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}

export abstract class CVFIOComponent extends CVFComponent {
  // Conexões que o componente irá receber
  targets: TargetHandle[] = [{ title: 'src1', position: Position.Left }];
  // Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}
