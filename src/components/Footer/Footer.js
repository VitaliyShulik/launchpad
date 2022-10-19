import React from "react";
import { SocialIcon } from "react-social-icons";
import IDOFactory from "../../contracts/IDOFactory.json";
import LockerFactory from "../../contracts/TokenLockerFactory.json";
import { networks } from "../../utils/chainInfo";
import {
  Box,
  Column,
  Container,
  FooterLink,
  Heading,
  Row,
} from "./FooterStyle";

const Footer = () => {
  const networkId = process.env.REACT_APP_networkID || 5
  const { explorer } = networks[networkId]
  return (
    <Box>
      <hr
        style={{
          color: "#ffffff",
          backgroundColor: "#ffffff",
          height: 1,
          borderColor: "#ffffff",
        }}
      />
      <Container style={{ padding: 30 }}>
        <Row jc="space-evenly" style={{ flexWrap: "wrap" }}>
          <Column className="text-collapse">
            <Heading>Contract Addresses</Heading>
            <p>IDO Factory: </p>
            <FooterLink
              target="_blank"
              href={
                explorer +
                "address/" +
                IDOFactory.networks[networkId].address
              }
            >
              {IDOFactory.networks[networkId].address}
            </FooterLink>
              <p>Locker Factory: </p>
              <FooterLink
                target="_blank"
                href={
                  explorer +
                  "address/" +
                  LockerFactory.networks[networkId].address
                }
              >
                {LockerFactory.networks[networkId].address}
              </FooterLink>
            {/*  */}
          </Column>
          <Column fd="row" jc="space-evenly">
            <SocialIcon
              network="email"
              url="mailto:support@onout.org?subject=IDOFactory&body=Hello, write you from IDOFactory demo..."
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              network="telegram"
              url="https://t.me/swaponline"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              network="discord"
              url="https://discord.gg/ukkgCUsU5c"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
            <SocialIcon
              url="https://tools.onout.org/"
              target="_blank"
              bgColor="#fff"
              fgColor="#000000"
            />
          </Column>
        </Row>
      </Container>
    </Box>
  );
};
export default Footer;
