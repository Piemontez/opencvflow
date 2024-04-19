import { Nav, Navbar } from 'react-bootstrap';
import { version } from '../../../../package.json';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';
import { useDarkModeStore } from '../../contexts/DarkModeStore';

/**
 * Rodapé,
 * contém resumos dos elementos sendos processados
 * ou jánelas/node que foram clicados
 */
const StatusBar = () => {
  const [nodes, edges] = useNodeStore(useShallow((state) => [state.nodes, state.edges]));
  const mode = useDarkModeStore(useShallow((state) => state.mode));

  return (
    <Navbar id="statusbar" bg={mode} variant={mode}>
      <Nav fill>
        <Nav.Item>
          <Nav.Link eventKey="components" disabled>
            Nodes: {nodes.length} Edges: {edges.length}
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
    </Navbar>
  );
};

export default StatusBar;
