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
  const { account, FeeToken } = useSelector((state) => state.blockchain);
  const {
    ETHamount,
    FeeTokenamount,
    FeeTokenSymbol,
  } = useSelector((state) => state.data);

  const mockCompanyLogo = 'https://wallet.wpmix.net/wp-content/uploads/2020/07/yourlogohere.png';

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ margin: 15 }}>
      <Container style={{ maxWidth: "100%" }}>
        {!mockCompanyLogo ? (
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
              YourTextLogo
            </s.Card>
          </s.TextTitle>
        ) : <s.LogoTitle src={mockCompanyLogo} />
        }
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/home">
              <Nav.Link>Home</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/launchpad">
              <Nav.Link>Launchpad</Nav.Link>
            </LinkContainer>
            {
              process.env.REACT_APP_ENABLE_LOCKER === 'true' &&
              <LinkContainer to="/locker">
                <Nav.Link>Locker</Nav.Link>
              </LinkContainer>
            }
            <LinkContainer to="/account">
              <Nav.Link>Account</Nav.Link>
            </LinkContainer>
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
                  href={`${process.env.REACT_APP_Explorer}address/${FeeToken._address}`}
                  target="_blank"
                >
                  {`$${FeeTokenSymbol} ` +
                    BigNumber(FeeTokenamount)
                      .dividedBy(10 ** 18)
                      .toFormat(0)}
                </Nav.Link>
                {/* <NavDropdown.Item href="#action/3.3"></NavDropdown.Item> */}
                <NavDropdown.Divider />
              </NavDropdown>
            ) : null}
          </Nav>
          <s.Container ai="center">
            {account == null ? (
              <s.button
                onClick={() => {
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
                {account}
              </s.button>
            )}
          </s.Container>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
