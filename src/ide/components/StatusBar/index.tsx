import { Nav, Navbar } from 'react-bootstrap';
import { version } from '../../../../package.json';
import { useNodeStore } from '../../../core/contexts/NodeStore';
import { useShallow } from 'zustand/react/shallow';
import { useProjectStore } from '../../contexts/ProjectStore';

/**
 * Rodapé,
 * contém resumos dos elementos sendos processados
 * ou jánelas/node que foram clicados
 */
const StatusBar = () => {
  const projectName = useProjectStore(useShallow((state) => state.name));
  const [nodes, edges] = useNodeStore(useShallow((state) => [state.nodes, state.edges]));

  return (
    <Navbar id="statusbar">
      <Nav fill>
        <Nav.Link disabled>Project: {projectName}</Nav.Link>
        <Nav.Link disabled>
          Nodes: {nodes.length} Edges: {edges.length}
        </Nav.Link>
        <Nav.Link href="https://www.linkedin.com/in/piemontez/" target="_blank">
          Developed by @piemontez{' '}
        </Nav.Link>
        <Nav.Link href="https://github.com/piemontez/opencvflow" target="_blank">
          Version: {version}
        </Nav.Link>
      </Nav>
    </Navbar>
  );
};

export default StatusBar;
