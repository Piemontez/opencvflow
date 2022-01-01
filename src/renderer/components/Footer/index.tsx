import { Nav } from 'react-bootstrap';
/**
 * Rodapé, 
 * contém resumos do dos elemento sendo processados
 * ou jánelas/node que foram clicados
 */
const Footer = () => {
  return (
    <Nav
      justify
    >
      <Nav.Item>
        <Nav.Link eventKey="components" disabled>Components Add: 0</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="https://www.linkedin.com/in/piemontez/" target="_blank">
          Developed by @piemontez
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link eventKey="disabled" disabled>
          Version: 0.1.1
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Footer;
