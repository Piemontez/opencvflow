import React from 'react';
import { Handle } from 'react-flow-renderer';
import { SourceHandle, TargetHandle } from './handle';
import { ComponentMenuAction } from './menu';
import { CVFNodeProcessor, EmptyNodeProcessor } from './node';

type OCVComponentData = {
  id: string;
  data: CVFNodeProcessor;
  type: string;
};

type OCVComponentProcessor = (() => CVFNodeProcessor) | typeof CVFNodeProcessor;

/**
 * Componente/NodeType
 */
export abstract class CVFComponent extends React.Component<OCVComponentData> {
  //Conexões que o componente pode receber
  targets: TargetHandle[] = [];
  //Conexões que o componente irá disparar
  sources: SourceHandle[] = [];
  //Função responsável em instanciar o NodeProcessor
  processor: OCVComponentProcessor = () => new EmptyNodeProcessor();
  //Definição do menu que ira aparecer 
  menu?: ComponentMenuAction;

  //Nome do componente. Por padrão tem o mesmo nome do nó processador
  get name(): string {
    return this.props.data.name;
  }
  //Titulo exibido em tela. Por padrão exibe o nome do componente.
  get title(): string {
    return this.name;
  }

  render() {
    return (
      <div style={componentStyles}>
        {this.targets.map((target) => (
          <Handle
            type="target"
            position={target.position}
            style={{ borderRadius: 0 }}
          />
        ))}

        <div>{this.title}</div>

        {this.sources.map((source) => (
          <Handle
            type="target"
            position={source.position}
            style={{ borderRadius: 0 }}
          />
        ))}
      </div>
    );
  }
}

const componentStyles = {
  background: '#9CA8B3',
  color: '#FFF',
  padding: 10,
};
