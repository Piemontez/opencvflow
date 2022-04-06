import { observer } from 'mobx-react';
import { useContext, useRef } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { MenuStoreContext } from 'renderer/contexts/MenuStore';
import { NodeStoreContext } from 'renderer/contexts/NodeStore';
import { MenuWithElementTitleProps } from 'renderer/types/menu';
import About from '../About';
import { notify } from '../Notification';

/**
 * Menu principal
 * As opções do menu são adicionadas via plugin,
 * inclusive os plugins instalados junto com a aplicação.
 */
const Header = () => {
  const menuStore = useContext(MenuStoreContext);
  const nodeStore = useContext(NodeStoreContext);
  const aboutRef = useRef<About>(null);
  return (
    <>
      <About ref={aboutRef} />
      <Navbar id="header" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          <Navbar.Brand href="#home">OpenCV-FLOW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menuStore.tabs.map((tab) => (
                <Nav.Link
                  key={tab.title}
                  onClick={() => menuStore.changeCurrentTab(tab.title)}
                >
                  {tab.title}
                </Nav.Link>
              ))}
            </Nav>
            <Nav>
              <NavDropdown title="Help" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="https://opencvflow.org/docs/v_0"
                  target="_blank"
                >
                  Documentation
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.2">Donate</NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => aboutRef!.current!.handleShow()}
                >
                  About
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar id="subheader" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          {menuStore.currentTab && (
            <Nav>
              {menuStore.currentTab.actions.map((action) => {
                const key =
                  (action as MenuWithElementTitleProps).name ||
                  (action.title as string);
                return action.draggable ? (
                  <Nav.Item
                    key={key}
                    onClick={() => {
                      notify.info(
                        'Drag (with mouse) this menu and drop into the painel.'
                      );
                    }}
                    onDragStart={(event: any) =>
                      nodeStore.onDragStart(event, action)
                    }
                    draggable
                  >
                    <Nav.Link eventKey="components" onClick={action.action}>
                      {action.title}
                    </Nav.Link>
                  </Nav.Item>
                ) : (
                  <Nav.Item key={key}>
                    <Nav.Link eventKey="components" onClick={action.action}>
                      {action.title}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
};

export default observer(Header);
