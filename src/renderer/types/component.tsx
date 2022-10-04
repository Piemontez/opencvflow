import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer/nocss';
import NodeDisplay from 'renderer/components/NodeDisplay';
import NodeTab from 'renderer/components/NodeTab';
import GCStore from 'renderer/contexts/GCStore';
import { SourceHandle, TargetHandle } from './handle';
import { ComponentMenuAction, MenuWithElementTitleProps } from './menu';
import { CVFNodeProcessor, EmptyNodeProcessor } from './node';

type OCVComponentData = {
  id: string;
  data: CVFNodeProcessor;
  type: string;
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
export abstract class CVFComponent extends React.Component<OCVComponentData> {
  output: HTMLCanvasElement | null = null;
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
    zoom: 0.5,
    options: CVFComponentOptions.NONE,
  };

  // Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    const { menu } = this.constructor as typeof CVFComponent;
    return (
      (menu as MenuWithElementTitleProps)?.name ||
      (menu?.title as string) ||
      this.constructor.name
    );
  }

  changeZoom(zoom: number) {
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
    const { data: processor } = this.props;
    processor.output = (mat: Mat) => {
      if (this.output) {
        const { zoom, options } = this.state;
        const notDisplay = options & CVFComponentOptions.NOT_DISPLAY;
        if (!notDisplay) {
          const rows = mat.rows * zoom;
          const cols = mat.cols * zoom;
          const newSize = new cv.Size(cols, rows);
          const out: Mat = new cv.Mat(rows, cols, mat.type());
          GCStore.add(out);
          cv.resize(mat, out, newSize);

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
    return (
      <div className="node">
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
          {data.body() || (
            <NodeDisplay
              component={this}
              canvasRef={(ref) => (this.output = ref)}
            />
          )}
        </div>

        {this.sources.map((source, idx) => (
          <Handle
            id={source.title}
            key={source.title}
            type="source"
            position={source.position}
            style={{ top: 40 + 40 * idx, borderRadius: 0 }}
          >
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
