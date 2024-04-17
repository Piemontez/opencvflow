import { RefObject, memo, useRef } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useMenuStore } from '../../contexts/MenuStore';
import { MenuWithElementTitleProps } from '../../types/menu';
import About, { AboutRef } from '../About';
import Donate, { DonateRef } from '../Donate';
import { useShallow } from 'zustand/react/shallow';
import { useNotificationStore } from '../Notification/store';
import { useNodeStore } from '../../contexts/NodeStore';

/**
 * Menu principal
 * As opções do menu são adicionadas via plugin,
 * inclusive os plugins instalados junto com a aplicação.
 */
const Header = memo(() => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentTab));
  const donateRef = useRef<DonateRef>(null);
  const aboutRef = useRef<AboutRef>(null);

  return (
    <>
      {
        /** Elementos adicionais do componente */
        menuCurrentTab &&
          menuCurrentTab.actions
            .filter((action) => (action as MenuWithElementTitleProps).headerExtraElement)
            .map((action) => (action as MenuWithElementTitleProps).headerExtraElement)
      }

      <Donate ref={donateRef} />
      <About ref={aboutRef} />
      <Navbar id="header" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          <Navbar.Brand href="#home">OpenCV-FLOW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavsLinks position="left" />
            </Nav>
            <Nav>
              <NavsLinks position="rigth" />
              <HelpDropDown donateRef={donateRef} aboutRef={aboutRef} />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Navbar id="subheader" bg="dark" variant="dark" expand="sm">
        <Container fluid>
          {/**Botões dos componentes */}
          <SubHeader />
        </Container>
      </Navbar>
    </>
  );
});

const NavsLinks = ({ position }: { position: 'left' | 'rigth' }) => {
  const [tabs, changeCurrentTab] = useMenuStore(useShallow((state) => [state.tabs, state.changeCurrentTab]));
  return tabs
    .filter((tab) => tab.position === position)
    .map((tab) =>
      tab.dropdown ? (
        <NavDropdown key={tab.title} title={tab.title} id="collasible-nav-dropdown">
          {tab.actions.map((action, idx) => (
            <NavDropdown.Item key={idx} onClick={action.action}>
              {action.title as string}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      ) : (
        <Nav.Link key={tab.title} onClick={() => changeCurrentTab(tab.title)}>
          {tab.title}
        </Nav.Link>
      ),
    );
};

const SubHeader = memo(() => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentTab));
  const onDragStart = useNodeStore(useShallow((state) => state.onDragStart));

  return (
    menuCurrentTab && (
      <Nav>
        {menuCurrentTab.actions.map((action) => {
          const key = (action as MenuWithElementTitleProps).name || (action.title as string);

          return action.draggable ? (
            <Nav.Item
              key={key}
              onClick={() => {
                useNotificationStore.getState().info('Drag (with mouse) this menu and drop into the painel.');
              }}
              onDragStart={(event: any) => onDragStart(event, action)}
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
  );
});

const HelpDropDown = memo(({ donateRef, aboutRef }: { donateRef: RefObject<DonateRef>; aboutRef: RefObject<AboutRef> }) => {
  return (
    <NavDropdown title="Help" id="collasible-nav-dropdown">
      <NavDropdown.Item href="https://opencvflow.org/docs/v_0" target="_blank">
        Documentation
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={() => donateRef.current!.handleShow()}>Donate</NavDropdown.Item>
      <NavDropdown.Item onClick={() => aboutRef.current!.handleShow()}>About</NavDropdown.Item>
    </NavDropdown>
  );
});

export default Header;
