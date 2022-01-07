import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Row } from 'react-bootstrap';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { CVFNodeProcessor } from 'renderer/types/node';
import { CVFFormGroup } from '../Form';

/**
 * Exibe as propriedades do componete/nó selecionado
 */
const PropertyBar = () => {
  const noteStore = useContext(NodeStoreContext);
  const processor = noteStore.currentElement?.data as CVFNodeProcessor;
  const curElTypeof = processor?.constructor as typeof CVFNodeProcessor;

  return (
    <div className="propertybar">
      <h1 className="header">{curElTypeof?.name} Props</h1>
      {curElTypeof?.properties?.map(({ name, title, ...prop }) => (
        <CVFFormGroup
          groupAs={Row}
          column={true}
          key={name}
          name={name}
          title={title || name}
          {...prop}
          value={(processor as any)[name]}
          onChange={(value) => {
            (processor as any)[name] = value;
            noteStore.refreshCurrentElement();
          }}
        />
      ))}
    </div>
  );
};

export default observer(PropertyBar);
