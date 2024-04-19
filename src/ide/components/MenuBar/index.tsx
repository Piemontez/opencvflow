import logoIcon from '../../assets/imgs/logo.png';
import { RefObject, memo, useRef } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { useMenuStore } from '../../contexts/MenuStore';
import { MenuWithElementTitleProps } from '../../types/menu';
import About, { AboutRef } from '../About';
import Donate, { DonateRef } from '../Donate';
import { useShallow } from 'zustand/react/shallow';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDarkModeStore } from '../../contexts/DarkModeStore';

/**
 * Menu principal
 * As opções do menu são adicionadas via plugin,
 * inclusive os plugins instalados junto com a aplicação.
 */
const MenuBar = memo(() => {
  const menuCurrentTab = useMenuStore(useShallow((state) => state.currentTab));
  const donateRef = useRef<DonateRef>(null);
  const aboutRef = useRef<AboutRef>(null);
  const [mode, toggle] = useDarkModeStore(useShallow((state) => [state.mode, state.toggle]));

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
      <Navbar id="menubar" expand="sm">
        <Container fluid>
          <img src={logoIcon} style={{ margin: 8 }} height="32" alt="brazil" />
          <Navbar.Brand href="#home">OpenCV-FLOW</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <NavsLinks position="left" />
            </Nav>
            <Nav>
              <NavsLinks position="rigth" />
              <HelpDropDown donateRef={donateRef} aboutRef={aboutRef} />
              <Nav.Link onClick={toggle}>
                <FontAwesomeIcon icon={mode === 'dark' ? 'moon' : 'sun'} />
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
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

export default MenuBar;
