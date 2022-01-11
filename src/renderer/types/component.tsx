import cv, { Mat } from 'opencv-ts';
import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import NodeDisplay from 'renderer/components/NodeDisplay';
import NodeTab from 'renderer/components/NodeTab';
import { SourceHandle, TargetHandle } from './handle';
import { ComponentMenuAction } from './menu';
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
  //Conexões que o componente pode receber
  targets: TargetHandle[] = [];
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [];
  //Função responsável em instanciar o NodeProcessor
  static processor: OCVComponentProcessor = EmptyNodeProcessor;
  //Definição do menu que ira aparecer
  static menu?: ComponentMenuAction;

  //Titulo exibido em tela. Por padrão exibe o título definido no menu ou o nome do componente.
  get title(): string {
    return (
      (this.constructor as typeof CVFComponent).menu?.title ||
      this.constructor.name
    );
  }

  componentDidMount() {
    const processor = this.props.data;
    processor.output = (mat: Mat) => {
      if (this.output) {
        cv.imshow(this.output, mat);
      }
    };
  }

  render() {
    return (
      <div className="node">
        {this.targets.map((target, idx) => (
          <Handle
            id={`in${idx}`}
            key={`t${idx}`}
            type="target"
            position={target.position}
            style={{
              content: target.title,
              top: 40 + 20 * idx,
              borderRadius: 0,
            }}
          />
        ))}

        <NodeTab component={this} />

        <div className="node-body">
          {this.props.data.body() || (
            <NodeDisplay
              component={this}
              canvasRef={(ref) => (this.output = ref)}
            />
          )}
        </div>

        {this.sources.map((source, idx) => (
          <Handle
            id={`out${idx}`}
            key={`s${idx}`}
            type="source"
            position={source.position}
            style={{ top: 40 + 20 * idx, borderRadius: 0 }}
          />
        ))}
      </div>
    );
  }
}

export abstract class CVFOutputComponent extends CVFComponent {
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}

export abstract class CVFIOComponent extends CVFComponent {
  //Conexões que o componente irá receber
  targets: TargetHandle[] = [{ title: 'in', position: Position.Left }];
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}

export abstract class CVFIOEndlessComponent extends CVFComponent {
  //Conexões que o componente irá receber
  targets: TargetHandle[] = [{ title: 'in', position: Position.Left }];
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [{ title: 'out', position: Position.Right }];
}
