import React from 'react';
import { Handle } from 'react-flow-renderer';
import { SourceHandleDef, TargetHandleDef } from './handle';
import { CVFNodeProcessor } from './node';

type ComponentData = {
  id: string;
  data?: CVFNodeProcessor;
  type: string;
};

/**
 * Componente/Widget exibido
 */
export abstract class Component extends React.Component<ComponentData> {
  //Conexões que o componente pode receber
  targets: TargetHandleDef[] = [];
  //Conexões que o componente irá disparar
  sources: SourceHandleDef[] = [];

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

        <div>{data?.title}</div>

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
