import BigNumber from "bignumber.js";
import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "../../App.css";
import { useApplicationContext } from "../../context/applicationContext";
import styled from 'styled-components';
import * as s from "../../styles/global";
import { Web3Status } from "../Web3Status";
import Loader from "../Loader";
import { useWeb3React } from "@web3-react/core";
import { CURRENCY } from '../../assets/images';
import { Paper } from "@mui/material";

const NetworkCard = styled(Paper)`
  display: flex;
  justify-content: center;
  padding: 0 0.75rem 0 0.5rem;
`;

const IconWrapper = styled.div`
  display: flex;
  flex-flow: column nowrap;
  margin-right: 0.4rem;
  align-items: center;
  justify-content: center;

  & > img,
  span {
    height: ${({ size }) => (size ? size + 'px' : '24px')};
    width: ${({ size }) => (size ? size + 'px' : '24px')};
  }
`;

const Navigation = () => {
  const {
    domainSettings: {
      isLockerEnabled,
      logoUrl,
    },
    isAdmin,
    chainName,
    networkExplorer,
    baseCurrencySymbol,
    ETHamount,
    isNativeCoinBalanceFetching,
    FeeTokenAddress,
    FeeTokenamount,
    FeeTokenSymbol,
    isFeeTokenDataFetching,
  } = useApplicationContext();

  const { chainId } = useWeb3React();

  const mockCompanyLogo = 'https://wallet.wpmix.net/wp-content/uploads/2020/07/yourlogohere.png';

  const hasFeeToken = !isFeeTokenDataFetching && FeeTokenSymbol && FeeTokenAddress;

  const getNetworkInfo = () => {
    if (!chainId) return null;

    const networkImage = CURRENCY[chainId];

    return (
      chainName && (
        // TODO: make some wrapped card
        <NetworkCard elevation={2} title={`${chainName} network`}> 
          {!!networkImage && (
            <IconWrapper size={20}>
              <img src={networkImage} alt="network logo" />
            </IconWrapper>
          )}
          {chainName}
        </NetworkCard>
      )
    )
  }

  return (
    <Navbar collapseOnSelect expand="lg" variant="dark" style={{ margin: 15 }}>
      <Container style={{ maxWidth: "100%" }}>
        <s.LogoTitle src={logoUrl || mockCompanyLogo} />
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
              isLockerEnabled &&
              <LinkContainer to="/locker">
                <Nav.Link>Locker</Nav.Link>
              </LinkContainer>
            }
            <LinkContainer to="/account">
              <Nav.Link>Account</Nav.Link>
            </LinkContainer>
            {
              isAdmin &&
              <LinkContainer to="/manage">
                <Nav.Link>Manage</Nav.Link>
              </LinkContainer>
            }
          </Nav>
          <Nav>
            <Nav.Link>{getNetworkInfo()}</Nav.Link>

            {
              !hasFeeToken ? (
                <Nav.Link>
                  {
                    isNativeCoinBalanceFetching ?
                      <Loader/> :
                      `$${baseCurrencySymbol} ` +
                        BigNumber(ETHamount)
                          .dividedBy(10 ** 18)
                          .toFormat(2)
                  }
                </Nav.Link>
              ) : (
                <NavDropdown
                  title={
                    isNativeCoinBalanceFetching ?
                      <Loader/> :
                      `$${baseCurrencySymbol} ` +
                        BigNumber(ETHamount)
                          .dividedBy(10 ** 18)
                          .toFormat(2)
                  }
                  id="collasible-nav-dropdown"
                >
                  <Nav.Link
                    href={`${networkExplorer}/address/${FeeTokenAddress}`}
                    target="_blank"
                  >
                    {
                      isFeeTokenDataFetching ?
                        <Loader /> :
                        `$${FeeTokenSymbol} ` +
                          BigNumber(FeeTokenamount)
                            .dividedBy(10 ** 18)
                            .toFormat(0)
                    }
                  </Nav.Link>
                  {/* <NavDropdown.Item href="#action/3.3"></NavDropdown.Item> */}
                  <NavDropdown.Divider />
                </NavDropdown>
              )
            }
          </Nav>
          <Web3Status />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
