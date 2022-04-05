import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer/nocss';
import NodeDisplay from 'renderer/components/NodeDisplay';
import NodeTab from 'renderer/components/NodeTab';
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

  // Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    const { menu } = this.constructor as typeof CVFComponent;
    return (
      (menu as MenuWithElementTitleProps)?.name ||
      (menu?.title as string) ||
      this.constructor.name
    );
  }

  componentDidMount() {
    const { data: processor } = this.props;
    processor.output = (mat: Mat) => {
      if (this.output) {
        cv.imshow(this.output, mat);
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
