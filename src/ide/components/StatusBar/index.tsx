import { Nav, Navbar } from 'react-bootstrap';
import { version } from '../../../../package.json';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';

/**
 * Rodapé,
 * contém resumos dos elementos sendos processados
 * ou jánelas/node que foram clicados
 */
const StatusBar = () => {
  const [nodes, edges] = useNodeStore(useShallow((state) => [state.nodes, state.edges]));

  return (
    <Navbar id="statusbar">
      <Nav fill>
        <Nav.Item>
          <Nav.Link disabled>
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
