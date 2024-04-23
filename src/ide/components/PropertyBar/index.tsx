import { memo, useState } from 'react';
import { Button, Row } from 'react-bootstrap';
import { CVFNode, CVFNodeProcessor } from '../../../core/types/node';
import { CVFFormGroup } from '../Form';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * Exibe as propriedades do componete/nó selecionado
 */
const PropertyBar = memo(() => {
  const [show, setShow] = useState<boolean | undefined>(true);
  const handleShow = () => setShow(true);
  const handleHidden = () => setShow(false);

  const [currentElement, refreshCurrentElement] = useNodeStore(useShallow((state) => [state.currentElement, state.refreshCurrentElement]));
  const processor = (currentElement as CVFNode)?.data?.processor as CVFNodeProcessor;

  if (!processor) {
    return null;
  }

  return (
    <div className={'dockpropertybar ' + (show ? '' : 'contracted')}>
      {show ? (
        <Bar processor={processor} handleHidden={handleHidden} refreshCurrentElement={refreshCurrentElement} />
      ) : (
        <HiddenBar handleShow={handleShow} />
      )}
    </div>
  );
});

const Bar = ({
  processor,
  handleHidden,
  refreshCurrentElement,
}: {
  processor: CVFNodeProcessor;
  handleHidden: () => void;
  refreshCurrentElement: () => void;
}) => {
  const curElTypeof = processor?.constructor as typeof CVFNodeProcessor;

  return (
    <>
      <h1 className="header">
        {curElTypeof?.name || 'Properties'}
        <Button variant="transparent" size="sm" onClick={handleHidden}>
          <FontAwesomeIcon icon={'angles-right'} />
        </Button>
      </h1>
      <div className="properties">
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
              refreshCurrentElement();
            }}
          />
        ))}
      </div>
    </>
  );
};

const HiddenBar = ({ handleShow }: { handleShow: () => void }) => {
  return (
    <Button variant="transparent" size="sm" onClick={handleShow}>
      <FontAwesomeIcon icon={'angles-left'} />
    </Button>
  );
};

export default PropertyBar;
