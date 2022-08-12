import BigNumber from "bignumber.js";
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import "../../App.css";
import { clearCache, connect } from "../../redux/blockchain/blockchainActions";
import * as s from "../../styles/global";

const Navigation = () => {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const {
    ETHamount,
    EBTCamount,
    EBTCSymbol,
  } = useSelector((state) => state.data);

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ margin: 15 }}>
      <Container style={{ maxWidth: "100%" }}>
        <s.TextTitle style={{ fontSize: "24px" }}>
          <s.Card
            style={{
              padding: 10,
              margin: 0,
              paddingLeft: 20,
              paddingRight: 20,
              fontWeight: 700,
              color: "var(--primary)",
            }}
          >
            NEXTCUBATOR
          </s.Card>
        </s.TextTitle>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/launchpad">
              <Nav.Link>Launchpad</Nav.Link>
            </LinkContainer>
            {/* <LinkContainer to="/locker">
              <Nav.Link>Locker</Nav.Link>
            </LinkContainer> */}
            <LinkContainer to="/account">
              <Nav.Link>Account</Nav.Link>
            </LinkContainer>
            {/* <NavDropdown title="Resources" id="collasible-nav-dropdown">
              <Nav.Link
                href="https://jarupak-sri.gitbook.io/cfont-documents/"
                target="_blank"
              >
                Whitepaper
              </Nav.Link>
              <NavDropdown.Item href="#action/3.3"></NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>*/}
          </Nav>
          <Nav>
            <Nav.Link>{process.env.REACT_APP_networkID}</Nav.Link>
            {ETHamount >= 0 ? (
              <NavDropdown
                title={
                  `$${process.env.REACT_APP_CURRENCY || 'ETH'} ` +
                  BigNumber(ETHamount)
                    .dividedBy(10 ** 18)
                    .toFormat(2)
                }
                id="collasible-nav-dropdown"
              >
                <Nav.Link
                  href="https://jarupak-sri.gitbook.io/cfont-documents/"
                  target="_blank"
                >
                  {`$${EBTCSymbol} ` +
                    BigNumber(EBTCamount)
                      .dividedBy(10 ** 18)
                      .toFormat(0)}
                </Nav.Link>
                {/* <NavDropdown.Item href="#action/3.3"></NavDropdown.Item> */}
                <NavDropdown.Divider />
              </NavDropdown>
            ) : null}
          </Nav>
          <s.Container ai="center">
            {blockchain.account == null ? (
              <s.button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(connect());
                }}
              >
                CONNECT
              </s.button>
            ) : (
              <s.button
                className="address text-collapse"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(clearCache());
                }}
              >
                {blockchain.account}
              </s.button>
            )}
          </s.Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
