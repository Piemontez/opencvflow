import React from 'react';
import { Handle } from 'react-flow-renderer';
import { SourceHandleDef, TargetHandleDef } from './handle';
import { CVFNodeProcessor } from './node';

type OCVComponentData = {
  id: string;
  data: CVFNodeProcessor;
  type: string;
};

/**
 * Componente/NodeType
 */
export abstract class CVFComponent extends React.Component<OCVComponentData> {
  //Conexões que o componente pode receber
  targets: TargetHandleDef[] = [];
  //Conexões que o componente irá disparar
  sources: SourceHandleDef[] = [];

  //Nome do componente. Por padrão tem o mesmo nome do nó processador
  get name():string {
    return this.props.data.name;
  }

  render() {
    const { data } = this.props;
    return (
      <div style={componentStyles}>
        {this.targets.map((target) => (
          <Handle
            type="target"
            position={target.position}
            style={{ borderRadius: 0 }}
          />
        ))}

        <div>{data.title}</div>

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
