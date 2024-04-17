import { Nav } from 'react-bootstrap';
import { version } from '../../../../package.json';
import { useNodeStore } from '../../contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Rodapé,
 * contém resumos do dos elemento sendo processados
 * ou jánelas/node que foram clicados
 */
const Footer = () => {
  const elements = useNodeStore(useShallow((state) => state.elements));

  return (
    <Nav justify id="footer">
      <Nav.Item>
        <Nav.Link eventKey="components" disabled>
          Elements: {elements.length}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://www.linkedin.com/in/piemontez/" target="_blank">
          Developed by @piemontez{' '}
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://github.com/piemontez/opencvflow" target="_blank">
          Version: {version}
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Footer;
