import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
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
  //Conexões que o componente pode receber
  targets: TargetHandle[] = [];
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [];
  //Função responsável em instanciar o NodeProcessor
  static processor: OCVComponentProcessor = EmptyNodeProcessor;
  //Definição do menu que ira aparecer
  static menu?: ComponentMenuAction;

  //Titulo exibido em tela. Por padrão exibe o nome do componente.
  get title(): string {
    return this.constructor.name;
  }

  render() {
    return (
      <div style={componentStyles.border}>
        {this.targets.map((target, idx) => (
          <Handle
            key={`t${idx}`}
            type="target"
            position={target.position}
            style={{ borderRadius: 0 }}
          />
        ))}

        <div style={componentStyles.header}>{this.title}</div>

        {this.props.data.body() || <div style={componentStyles.body}></div>}

        {this.sources.map((source, idx) => (
          <Handle
            key={`s${idx}`}
            type="target"
            position={source.position}
            style={{ borderRadius: 0 }}
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

const componentStyles = {
  border: {
    minWidth: 100,
    border: '1px solid',
    borderColor: 'rgb(var(--bs-dark-rgb))',
    borderRadius: 3,
  },
  header: {
    padding: 3,
    background: 'rgb(var(--bs-dark-rgb))',
    color: 'var(--bs-light)',
    fontSize: '0.5rem',
    width: '100%',
  },
  body: {
    minHeight: 60,
    width: '100%',
  },
};
