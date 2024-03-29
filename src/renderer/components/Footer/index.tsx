import { observer } from 'mobx-react';
import { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { version } from '../../../../package.json';

/**
 * Rodapé,
 * contém resumos do dos elemento sendo processados
 * ou jánelas/node que foram clicados
 */
const Footer = () => {
  const noteStore = useContext(NodeStoreContext);

  return (
    <Nav justify id="footer">
      <Nav.Item>
        <Nav.Link eventKey="components" disabled>
          Elements: {noteStore.elements.length}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://www.linkedin.com/in/piemontez/" target="_blank">
          Developed by @piemontez{' '}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          href="https://github.com/piemontez/opencvflow"
          target="_blank"
        >
          Version: {version}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default observer(Footer);
