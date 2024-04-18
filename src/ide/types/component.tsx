import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'reactflow';
import NodeDisplay from '../components/NodeDisplay';
import NodeTab from '../components/NodeTab';
import { NodeSizes } from '../../core/config/sizes';
import GCStore from '../../core/contexts/GCStore';
import { SourceHandle, TargetHandle } from '../../core/types/handle';
import { ComponentMenuAction, MenuWithElementTitleProps } from './menu';
import { CVFNodeData, CVFNodeProcessor, EmptyNodeProcessor } from '../../core/types/node';

type OCVComponentProps = {
  id: string;
  data: CVFNodeData;
  type: string;
};

type OCVComponentState = {
  zoom: number | 'AUTO_SCALE';
  options: number;
};

class ForkCVFNodeProcessor extends CVFNodeProcessor {}
type OCVComponentProcessor = typeof ForkCVFNodeProcessor;

export enum CVFComponentOptions {
  NONE = 0,
  NOT_DISPLAY = 1,
  NEXT_OPTION_02 = 2,
  NEXT_OPTION_01 = 4,
}

/**
 * Componente/NodeType
 */
export abstract class CVFComponent extends React.Component<OCVComponentProps, OCVComponentState> {
  private output: HTMLCanvasElement | null = null;
  // Conexões que o componente pode receber
  targets: TargetHandle[] = [];
  // Conexões que o componente irá disparar
  sources: SourceHandle[] = [];
  // Função responsável em instanciar o NodeProcessor
  static processor: OCVComponentProcessor = EmptyNodeProcessor;
  // Definição do menu que ira aparecer
  static menu?: ComponentMenuAction;
  // Opções
  // eslint-disable-next-line react/state-in-constructor
  state = {
    zoom: 'AUTO_SCALE' as number | 'AUTO_SCALE',
    options: CVFComponentOptions.NONE,
  };

  // Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    const { menu } = this.constructor as typeof CVFComponent;
    return (menu as MenuWithElementTitleProps)?.name || (menu?.title as string) || this.constructor.name;
  }

  changeZoom(zoom: number | 'AUTO_SCALE') {
    this.setState({ zoom });
  }

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
      if (this.output) {
        const { zoom, options } = this.state as OCVComponentState;
        const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
        if (!notDisplay) {
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

          const newSize = new cv.Size(cols, rows);
          const out: Mat = new cv.Mat(rows, cols, mat.type());
          GCStore.add(out);
          cv.resize(mat, out, newSize, 0, 0, cv.INTER_NEAREST);

          cv.imshow(this.output, out);
        }
      }
    };

    processor.outputMsg = (msg: string) => {
      if (this.output) {
        const ctx = this.output.getContext('2d');
        if (ctx) {
          ctx.fillText(msg, 15, 15);
        }
      }
    };
  }

  render() {
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

        <div className="node-body">{processor.body() || <NodeDisplay component={this} canvasRef={(ref) => (this.output = ref)} />}</div>

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

export abstract class CVFIOEndlessComponent extends CVFComponent {
  // Conexões que o componente irá receber
  targets: TargetHandle[] = [{ title: 'src1', position: Position.Left }];
  // Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}
