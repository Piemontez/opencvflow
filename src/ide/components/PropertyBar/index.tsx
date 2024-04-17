import { useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { CVFNode, CVFNodeProcessor } from '../../types/node';
import { CVFFormGroup } from '../Form';
import { useNodeStore } from '../../contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Exibe as propriedades do componete/nó selecionado
 */
const PropertyBar = () => {
  const [show, setShow] = useState(true);
  const noteStore = useNodeStore(useShallow((state) => state));
  const processor = (noteStore.currentElement as CVFNode)?.data?.processor as CVFNodeProcessor;
  const curElTypeof = processor?.constructor as typeof CVFNodeProcessor;

  return (
    <div className={'propertybar ' + (show ? '' : 'contracted')}>
      {show ? (
        <>
          <h1 className="header">
            {curElTypeof?.name} Props
            <Button variant="light" size="sm" onClick={() => setShow(false)}>
              {'>>'}
            </Button>
          </h1>
          {processor?.properties?.map(({ name, title, ...prop }) => (
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
                processor.propertyChange(name, value);
                noteStore.refreshCurrentElement();
              }}
            />
          ))}
        </>
      ) : (
        <h1 className="header">
          <Button variant="light" size="sm" onClick={() => setShow(true)}>
            {'<<'}
          </Button>
        </h1>
      )}
    </div>
  );
};

export default PropertyBar;
