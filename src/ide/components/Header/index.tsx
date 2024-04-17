import { useRef } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
//import { MenuStoreContext } from 'renderer/contexts/MenuStore';
//import { NodeStoreContext } from 'renderer/contexts/NodeStore';
//import { MenuWithElementTitleProps } from 'renderer/types/menu';
import About, { AboutRef } from '../About';
import Donate, { DonateRef } from '../Donate';
//import { notify } from '../Notification';

/**
 * Menu principal
 * As opções do menu são adicionadas via plugin,
 * inclusive os plugins instalados junto com a aplicação.
 */
const Header = () => {
  //const menuStore = useContext(MenuStoreContext);
  //const nodeStore = useContext(NodeStoreContext);
  const donateRef = useRef<DonateRef>(null);
  const aboutRef = useRef<AboutRef>(null);

  return (
    <>
      {/*
        /** Elementos adicionais do componente * /
        menuStore.currentTab &&
          menuStore.currentTab.actions
            .filter(
              (action) =>
                (action as MenuWithElementTitleProps).headerExtraElement
            )
            .map(
              (action) =>
                (action as MenuWithElementTitleProps).headerExtraElement
            )
      */}

      <Donate ref={donateRef} />
      <About ref={aboutRef} />
      <Navbar id="header" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          <Navbar.Brand href="#home">OpenCV-FLOW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* <Nav className="me-auto">{makeNavsLinks('left')}</Nav> */}
            <Nav>
              {/* {makeNavsLinks('rigth')} */}
              <NavDropdown title="Help" id="collasible-nav-dropdown">
                <NavDropdown.Item
                  href="https://opencvflow.org/docs/v_0"
                  target="_blank"
                >
                  Documentation
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => donateRef.current!.handleShow()}
                >
                  Donate
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => aboutRef.current!.handleShow()}
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
          {/*
            /**Botões dos componentes * /
            menuStore.currentTab && (
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
                        {action.title as string}
                      </Nav.Link>
                    </Nav.Item>
                  ) : (
                    <Nav.Item key={key}>
                      <Nav.Link eventKey="components" onClick={action.action}>
                        {action.title as string}
                      </Nav.Link>
                    </Nav.Item>
                  );
                })}
              </Nav>
            )
          */}
        </Container>
      </Navbar>
    </>
  );
};

/*const makeNavsLinks = (position: 'left' | 'rigth') => {
  const menuStore = useContext(MenuStoreContext);

  return menuStore.tabs
    .filter((tab) => tab.position === position)
    .map((tab) =>
      tab.dropdown ? (
        <NavDropdown title={tab.title} id="collasible-nav-dropdown">
          {tab.actions.map((action) => (
            <NavDropdown.Item onClick={action.action}>
              {action.title as string}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      ) : (
        <Nav.Link
          key={tab.title}
          onClick={() => menuStore.changeCurrentTab(tab.title)}
        >
          {tab.title}
        </Nav.Link>
      )
    );
};*/

export default Header;
