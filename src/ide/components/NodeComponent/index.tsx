import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'reactflow';
import NodeDisplay, { NodeZoom } from './NodeDisplay';
import NodeTab from './NodeTab';
import { NodeSizes } from '../../../core/config/sizes';
import GCStore from '../../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../../core/types/handle';
import { ComponentMenuAction, MenuWithElementTitleProps } from '../../types/menu';
import { CVFNodeData, CVFNodeProcessor } from '../../../core/types/node';
import { ZoomScale } from '../../types/ZoomScale';
import { ZOOM_BOX_SIZE, ZOOM_BOX_SIZE_HALF } from '../../commons/consts';
import { CVFComponentOptions } from './CVFComponentOptions';

type OCVComponentProps = {
  id: string;
  data: CVFNodeData;
  type: string;
};

type OCVComponentState = {
  scale: ZoomScale;
  showZoom?: boolean;
  options: number;
};

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

  zoom = {
    x: 0,
    y: 0,
    width: 0,
    scale: 0, // Escala de zoom do componente
    scaleZoom: 0, // Escala de zoom da lupa de aumento
  };

  // Opções
  state = {
    scale: ZoomScale.PERC_AUTO,
    showZoom: false,
    options: CVFComponentOptions.NONE,
  };

  // Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    const { menu } = this.constructor as typeof CVFComponent;
    return (menu as MenuWithElementTitleProps)?.name || (menu?.title as string) || this.constructor.name;
  }

  /**
   * Escala(Zoom) de visualização da imagem
   * @param scale
   */
  changeScale(scale: ZoomScale) {
    this.setState({ scale });
  }

  /**
   * Modal adicional com zoom
   * @param x
   * @param y
   */
  showZoom(x: number, y: number) {
    const { left, top, width } = this.canvasRef!.getBoundingClientRect();

    this.zoom.x = x - Math.floor(left);
    this.zoom.y = y - Math.floor(top);
    this.zoom.width = Math.floor(width);

    this.setState({ showZoom: true });
  }

  hideZoom = () => {
    this.setState({ showZoom: false });
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

    processor.output = (mat: Mat) => {
      const notDisplay = this.state.options & CVFComponentOptions.NOT_DISPLAY;
      if (notDisplay) {
        return;
      }

      this.calculateScale(mat);
      this.output(mat);
      this.outputZoom(mat);
    };
    processor.outputMsg = this.outputMsg;
  }

  private calculateScale = (mat: Mat) => {
    const { scale } = this.state;
    const { x, y, width } = this.zoom;

    // Escala do componente
    if (scale === 'AUTO_SCALE') {
      const min = Math.min(mat.rows, mat.cols);
      this.zoom.scale = NodeSizes.defaultHeight / min;
    } else {
      this.zoom.scale = scale;
    }

    // Escala da lupa de aumento
    this.zoom.scaleZoom = mat.cols / width;
    this.zoom.x = Math.max(Math.min(x * this.zoom.scaleZoom + ZOOM_BOX_SIZE_HALF, mat.rows) - ZOOM_BOX_SIZE_HALF, 0);
    this.zoom.y = Math.max(Math.min(y * this.zoom.scaleZoom + ZOOM_BOX_SIZE_HALF, mat.rows) - ZOOM_BOX_SIZE_HALF, 0);
  };

  private output = (mat: Mat) => {
    if (this.canvasRef) {
      const { scale } = this.state;

      let out: Mat;
      if (ZoomScale.PERC_100 === scale) {
        out = mat;
      } else {
        let cols = mat.cols * this.zoom.scale;
        let rows = mat.rows * this.zoom.scale;

        out = GCStore.add(new cv.Mat(rows, cols, mat.type()));
        cv.resize(mat, out, new cv.Size(cols, rows), 0, 0, cv.INTER_NEAREST);
      }
      cv.imshow(this.canvasRef, out);
    }
  };

  private outputZoom = (mat: Mat) => {
    if (this.canvasZoomRef && this.state.showZoom) {
      let { x, y } = this.zoom;

      const roi = GCStore.add(mat.roi(new cv.Rect(x, y, ZOOM_BOX_SIZE, ZOOM_BOX_SIZE)));
      const zoom = GCStore.add(new cv.Mat());

      cv.resize(roi, zoom, new cv.Size(NodeSizes.defaultWidth, NodeSizes.defaultHeight), 0, 0, cv.INTER_NEAREST);
      cv.imshow(this.canvasZoomRef, zoom);
    }
  };

  private outputMsg = (msg: string) => {
    if (this.canvasRef) {
      const ctx = this.canvasRef.getContext('2d');
      if (ctx) {
        ctx.fillText(msg, 15, 15);
      }
    }
  };

  render() {
    const { showZoom } = this.state;
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
          {!!showZoom && (
            <NodeZoom
              canvasRef={(ref) => (this.canvasZoomRef = ref)}
              pos={this.zoom!}
              scale={(this.canvasRef?.width || 1) / (this.zoom?.width || 1)}
            />
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
