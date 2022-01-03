import { useContext } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { MenuStoreContext } from 'renderer/contexts/MenuStore';

/**
 * Menu principal
 * As opções do menu são adicionadas via plugin,
 * inclusive os plugins instalados junto com a aplicação.
 */
const Header = () => {
  const menuStore = useContext(MenuStoreContext);

  return (
    <>
      <Navbar id="header" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          <Navbar.Brand href="#home">OpenCV-FLOW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {menuStore.tabs.map((tab) => (
                <Nav.Link
                  key={tab.title}
                  onClick={() => menuStore.changeCurrentTab(tab)}
                  onMouseOver={() => menuStore.changeCurrentTab(tab)}
                >
                  {tab.title}
                </Nav.Link>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar id="subheader" bg="dark" variant="dark" expand="sm">
        {menuStore.currentTab && (
          <Nav>
            {menuStore.currentTab.actions.map((action) => (
              <Nav.Item>
                <Nav.Link eventKey="components" disabled>
                  {action.title}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
        )}
      </Navbar>
    </>
  );
};

export default Header;
